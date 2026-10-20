'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { validateCreateCategory } from '../utils/categoryValidate';
import { Category } from '@/domains/categories/types/category.types';

export async function addCategory(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const errors = validateCreateCategory(formData);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    const name = (formData.get('name') as string).trim();
    const parentId = ((formData.get('parent_id') as string) ?? '').trim();
    const type = formData.get('type') as string;
    const supabase = createServerClient();
    let sortOrder = 1;
    let depth = 0;

    // TODO : 회원 권한 체크

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
    const supabase = createServerClient();
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
    const supabase = createServerClient();
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
    const supabase = createServerClient();

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
    const errors = validateCreateCategory(formData);
    const id = formData.get('id');
    if (typeof id !== 'string' || !id.trim()) {
        errors.form = '수정할 카테고리를 선택해주세요.';
    }
    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    const name = (formData.get('name') as string).trim();
    const parentId = ((formData.get('parent_id') as string) ?? '').trim();
    const type = formData.get('type') as string;
    const supabase = createServerClient();
    const { data: categories, error: listError } = await getCategoryRows();
    if (listError || !categories) {
        return {
            success: false,
            errors: { form: '카테고리를 조회하지 못했습니다.' },
        };
    }

    const category = categories.find((item) => item.id === id);
    if (!category) {
        return {
            success: false,
            errors: { form: '카테고리를 찾을 수 없습니다.' },
        };
    }

    const children = getChildCategories(categories, category.id);
    if (
        parentId === category.id ||
        children.some((item) => item.id === parentId)
    ) {
        return {
            success: false,
            errors: {
                parent_id: '자기 자신이나 하위 카테고리를 선택할 수 없습니다.',
            },
        };
    }

    if (category.type !== type) {
        if (children.length > 0) {
            return {
                success: false,
                errors: {
                    type: '하위 카테고리가 있으면 타입을 변경할 수 없습니다.',
                },
            };
        }
        const { count: productCount, error: productError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', id);
        const { count: boardCount, error: boardError } = await supabase
            .from('boards')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', id);
        if (productError || boardError) {
            return {
                success: false,
                errors: { form: '연결된 데이터를 확인하지 못했습니다.' },
            };
        }
        if ((productCount ?? 0) > 0 || (boardCount ?? 0) > 0) {
            return {
                success: false,
                errors: {
                    type: '연결된 상품 또는 게시판이 있어 타입을 변경할 수 없습니다.',
                },
            };
        }
    }

    let depth = 0;
    if (parentId !== '') {
        const { data: parent, error: parentError } = await getParentCategory(
            parentId,
            type,
        );
        if (
            parentError ||
            !parent ||
            !Number.isInteger(parent.depth) ||
            parent.depth < 0
        ) {
            return {
                success: false,
                errors: {
                    parent_id: '동일한 타입의 상위 카테고리를 선택해주세요.',
                },
            };
        }
        depth = parent.depth + 1;
    }

    let sortOrder = category.sort_order;
    if ((category.parent_id ?? '') !== parentId || category.type !== type) {
        const { data: lastCategory, error: orderError } =
            await getLastSortOrder(parentId, type);
        if (orderError) {
            return {
                success: false,
                errors: { form: '표시 순서를 조회하지 못했습니다.' },
            };
        }
        sortOrder = (lastCategory?.sort_order ?? 0) + 1;
    }

    if (
        !Number.isInteger(category.depth) ||
        category.depth < 0 ||
        children.some((item) => !Number.isInteger(item.depth) || item.depth < 0)
    ) {
        return {
            success: false,
            errors: { form: '기존 카테고리의 단계 설정을 확인해주세요.' },
        };
    }

    const depthDifference = depth - category.depth;
    const updates = [
        {
            ...category,
            name: name,
            parent_id: parentId,
            type: type,
            depth: depth,
            sort_order: sortOrder,
        },
    ];
    if (depthDifference !== 0) {
        for (const child of children) {
            updates.push({ ...child, depth: child.depth + depthDifference });
        }
    }

    const { error } = await supabase
        .from('category')
        .upsert(updates, { onConflict: 'id' });
    if (error) {
        return {
            success: false,
            errors: { form: '수정에 실패했습니다. 다시 시도해주세요.' },
        };
    }

    revalidatePath('/admin/category');
    return { success: true };
}

async function getCategoryRows() {
    const supabase = createServerClient();
    return await supabase.from('category').select('*').is('deleted_at', null);
}

function getChildCategories(
    categories: Category[],
    parentId: string,
): Category[] {
    const result: Category[] = [];
    const parentIds = [parentId];
    const visitedIds = new Set<string>([parentId]);

    while (parentIds.length > 0) {
        const currentParentId = parentIds.shift();
        for (const category of categories) {
            if (
                category.parent_id === currentParentId &&
                !visitedIds.has(category.id)
            ) {
                visitedIds.add(category.id);
                result.push(category);
                parentIds.push(category.id);
            }
        }
    }
    return result;
}

export async function getParentCategoryList(type: string) {
    const supabase = createServerClient();
    return await supabase
        .from('category')
        .select('id, parent_id, name, depth, sort_order, type')
        .eq('type', type)
        .is('deleted_at', null)
        .order('depth', { ascending: true })
        .order('sort_order', { ascending: true, nullsFirst: false });
}
