'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import {
    validateCreateCategory,
    validateUpdateCategory,
} from '../utils/categoryValidate';
import { Category } from '@/domains/categories/types/category.types';
import { isAdmin } from '../../utils/adminUtils';

export async function addCategory(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const errors = validateCreateCategory(formData);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    const name = (formData.get('name') as string).trim();
    const parentId = ((formData.get('parent_id') as string) ?? '').trim();
    const type = formData.get('type') as string;
    const supabase = await createServerClient();
    let sortOrder = 1;
    let depth = 0;

    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    if (parentId !== '') {
        const { data: parent, error: parentError } = await getParentCategory(
            parentId,
            type,
        );

        if (parentError || !parent) {
            return {
                success: false,
                errors: {
                    parent_id: '동일한 타입의 상위 카테고리를 선택해주세요.',
                },
            };
        }
        depth = parent.depth + 1;
    }

    const { data: lastCategory, error: orderError } = await getLastSortOrder(
        parentId,
        type,
    );

    if (orderError) {
        return {
            success: false,
            errors: { form: '표시 순서를 조회하지 못했습니다.' },
        };
    }

    if (lastCategory && lastCategory.sort_order !== null) {
        sortOrder = lastCategory.sort_order + 1;
    }

    const { error } = await supabase.from('category').insert({
        id: randomUUID(),
        name: name,
        parent_id: parentId,
        type: type,
        depth: depth,
        sort_order: sortOrder,
    });
    if (error) {
        return {
            success: false,
            errors: {
                form: '카테고리 등록에 실패했습니다. 다시 시도해주세요.',
            },
        };
    }

    revalidatePath('/admin/category');
    return { success: true };
}

async function getParentCategory(parentId: string, type: string) {
    const supabase = await createServerClient();
    const result = await supabase
        .from('category')
        .select('depth')
        .eq('id', parentId)
        .eq('type', type)
        .is('deleted_at', null)
        .maybeSingle();

    return result;
}

async function getLastSortOrder(parentId: string, type: string) {
    const supabase = await createServerClient();
    const result = await supabase
        .from('category')
        .select('sort_order')
        .eq('parent_id', parentId)
        .eq('type', type)
        .is('deleted_at', null)
        .order('sort_order', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

    return result;
}

export async function getCategoryList({
    searchName,
    searchType,
    searchDepth,
}: {
    searchName?: string;
    searchType?: string;
    searchDepth?: number;
} = {}) {
    const supabase = await createServerClient();

    let query = supabase.from('category').select('*').is('deleted_at', null);

    if (searchType) query = query.eq('type', searchType);

    if (searchDepth !== undefined) query = query.eq('depth', searchDepth);

    const { data, error } = await query.order('sort_order', {
        ascending: true,
    });

    if (error) {
        return { data: null, error: error };
    }

    const categories: Category[] = [];

    for (const row of data ?? []) {
        categories.push({
            ...row,
            children: [],
        });
    }

    const categoryTree: Category[] = [];

    for (const category of categories) {
        if (!category.parent_id) {
            categoryTree.push(category);
            continue;
        }

        const parent = categories.find(
            (item) => item.id === category.parent_id,
        );

        if (parent) {
            parent.children?.push(category);
        }
    }
    let result = categoryTree;

    if (searchName?.trim()) {
        result = filterCategoryTree(categoryTree, searchName);
    }

    return {
        data: result,
        error: null,
    };
}

function filterCategoryTree(
    categories: Category[],
    searchName: string,
): Category[] {
    const result: Category[] = [];
    const keyword = searchName.trim().toLowerCase();

    for (const category of categories) {
        if (category.name.toLowerCase().includes(keyword)) {
            result.push(category);
            continue;
        }

        const children = filterCategoryTree(
            category.children ?? [],
            searchName,
        );

        if (children.length > 0) {
            result.push({
                ...category,
                children: children,
            });
        }
    }

    return result;
}

export async function updateCategory(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const errors = validateUpdateCategory(formData);

    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    const id = formData.get('id');
    const name = (formData.get('name') as string).trim();
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('category')
        .update({ name: name })
        .eq('id', id);

    if (error) {
        return {
            success: false,
            errors: { form: '수정에 실패했습니다. 다시 시도해주세요.' },
        };
    }

    revalidatePath('/admin/category');
    return { success: true };
}

export async function getParentCategoryList(type: string) {
    const supabase = await createServerClient();
    return await supabase
        .from('category')
        .select('id, parent_id, name, depth, sort_order, type')
        .eq('type', type)
        .is('deleted_at', null)
        .order('depth', { ascending: true })
        .order('sort_order', { ascending: true, nullsFirst: false });
}

export async function deleteCategory(category: Category): Promise<ActionState> {
    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const supabase = await createServerClient();

    if ((await getChildCategoryCnt(category.id)) > 0) {
        return {
            success: false,
            errors: { alert: '하위 카테고리가 있어 삭제 불가능합니다.' },
        };
    }
    const { data, error } = await supabase
        .from('category')
        .update({
            deleted_at: new Date().toISOString(),
        })
        .eq('id', category.id);

    if (error) {
        console.log(error);
        return {
            success: false,
            errors: {
                alert: '삭제에 실패하였습니다.',
            },
        };
    }

    revalidatePath('/admin/category');
    return { success: true };
}

async function getChildCategoryCnt(id: string): Promise<number> {
    const supabase = await createServerClient();

    const { count } = await supabase
        .from('category')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', id);

    return count ?? 0;
}

export async function getCategoryListRaw(type?: string) {
    const supabase = await createServerClient();
    let query = supabase.from('category').select('*').is('deleted_at', null);

    if (type) query.eq('type', type);
    return await query.order('depth, sort_order', {
        ascending: true,
    });
}
