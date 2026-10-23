'use server';

import { createServerClient } from '@/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { validateSaveProduct } from '../utils/productValidate';
import { isAdmin } from '../../utils/adminUtils';
import { getAttachments, saveAttachments } from '@/shared/utils/file';
import type { StoredAttachment } from '@/domains/files/types/file.types';

export async function getProductAttachments(productId: string): Promise<{
    data: StoredAttachment[];
    error: string | null;
}> {
    if (!(await isAdmin())) {
        return { data: [], error: '권한이 없습니다.' };
    }

    try {
        const supabase = await createServerClient();
        const { data: product, error } = await supabase
            .from('products')
            .select('gid::text')
            .eq('id', productId)
            .single();

        if (error || !product) {
            return { data: [], error: '상품을 찾을 수 없습니다.' };
        }
        if (product.gid == null) return { data: [], error: null };

        return {
            data: await getAttachments(product.gid, 'product_main'),
            error: null,
        };
    } catch (error) {
        console.error('상품 첨부파일 조회 실패:', error);
        return { data: [], error: '상품 이미지를 불러오지 못했습니다.' };
    }
}

function readAttachments(formData: FormData) {
    const newFiles = formData.getAll('files');
    if (!newFiles.every((file): file is File => file instanceof File)) {
        throw new Error('잘못된 첨부파일입니다.');
    }

    let deletedIds: unknown;
    try {
        deletedIds = JSON.parse(String(formData.get('deletedIds') ?? '[]'));
    } catch {
        throw new Error('잘못된 삭제 파일 목록입니다.');
    }

    if (
        !Array.isArray(deletedIds) ||
        !deletedIds.every(
            (id): id is string =>
                typeof id === 'string' && /^[1-9]\d*$/.test(id),
        )
    ) {
        throw new Error('잘못된 삭제 파일 목록입니다.');
    }

    return { newFiles, deletedIds };
}

export async function getProductList(searchName?: string) {
    const supabase = await createServerClient();

    let query = supabase.from('products').select('*, category(name)');

    if (searchName) query = query.like('name', `%${searchName}%`);

    return await query;
}

export async function addProduct(formData: FormData): Promise<ActionState> {
    const errors = validateSaveProduct(formData);

    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    if (!(await isAdmin())) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const supabase = await createServerClient();
    let gid: string | undefined;
    try {
        const { newFiles, deletedIds } = readAttachments(formData);
        if (deletedIds.length > 0) {
            throw new Error('신규 상품에는 삭제할 첨부파일이 없습니다.');
        }
        gid = await saveAttachments({
            location: 'product_main',
            newFiles,
        });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                alert:
                    error instanceof Error
                        ? error.message
                        : '첨부파일 저장에 실패하였습니다.',
            },
        };
    }

    const { error } = await supabase.from('products').insert({
        name: String(formData.get('name')),
        price: Number(formData.get('price')),
        description: String(formData.get('description') ?? ''),
        isNew: Boolean(formData.get('isNew') ?? false),
        viewCount: 0,
        category_id: String(formData.get('category_id')),
        ...(gid !== undefined ? { gid } : {}),
    });

    if (error) {
        console.log(error);
        return { success: false, errors: { alert: '저장에 실패하였습니다.' } };
    }

    return { success: true };
}

export async function updateProduct(formData: FormData): Promise<ActionState> {
    const errors = validateSaveProduct(formData);

    const id = formData.get('id') ?? '';

    if (!id) errors.id = '선택된 상품이 없습니다.';

    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    if (!(await isAdmin())) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const supabase = await createServerClient();

    // 폼의 gid 대신 DB에 연결된 그룹을 사용합니다.
    const { data: product, error: lookupError } = await supabase
        .from('products')
        .select('gid::text')
        .eq('id', id)
        .single();

    if (lookupError || !product) {
        return {
            success: false,
            errors: { alert: '상품을 찾을 수 없습니다.' },
        };
    }

    let gid: string | undefined;
    try {
        const { newFiles, deletedIds } = readAttachments(formData);
        if (product.gid == null && deletedIds.length > 0) {
            throw new Error('삭제할 첨부파일 그룹이 없습니다.');
        }
        gid = await saveAttachments({
            gid: product.gid ?? undefined,
            location: 'product_main',
            newFiles,
            deletedIds,
        });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: {
                alert:
                    error instanceof Error
                        ? error.message
                        : '첨부파일 저장에 실패하였습니다.',
            },
        };
    }

    const { error } = await supabase
        .from('products')
        .update({
            name: String(formData.get('name')),
            price: Number(formData.get('price')),
            description: String(formData.get('description') ?? ''),
            isNew: Boolean(formData.get('isNew') ?? false),
            category_id: String(formData.get('category_id')),
            ...(gid !== undefined ? { gid } : {}),
        })
        .eq('id', id);

    if (error) {
        console.log(error);
        return { success: false, errors: { alert: '저장에 실패하였습니다.' } };
    }

    return { success: true };
}

export async function deleteProduct(id: string) {
    if (!(await isAdmin())) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const supabase = await createServerClient();

    // TODO : 연결된 gid나 board 삭제

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        return { success: false, errors: { alert: '삭제에 실패하였습니다.' } };
    }

    return { success: true };
}
