'use server';

import { createServerClient } from '@/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { validateSaveProduct } from '../utils/productValidate';
import { isAdmin } from '../../utils/adminUtils';

export async function getProductList(searchName?: string) {
    const supabase = createServerClient();

    let query = supabase.from('products').select('*, category(name)');

    if (searchName) query = query.like('name', `%${searchName}%`);

    return await query;
}

export async function addProduct(formData: FormData): Promise<ActionState> {
    const errors = validateSaveProduct(formData);

    if (Object.keys(errors).length > 0) {
        return { success: false, errors: errors };
    }

    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    const supabase = createServerClient();

    //TODO: gid 추가하여 insert에 넣기

    const { error } = await supabase.from('products').insert({
        name: String(formData.get('name')),
        price: Number(formData.get('price')),
        description: String(formData.get('description') ?? ''),
        isNew: Boolean(formData.get('isNew') ?? false),
        viewCount: 0,
        category_id: String(formData.get('category_id')),
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

    if (!isAdmin()) {
        return { success: false, errors: { alert: '권한이 없습니다.' } };
    }

    // TODO : gid 추가하기

    const supabase = createServerClient();

    const { error } = await supabase
        .from('products')
        .update({
            name: String(formData.get('name')),
            price: Number(formData.get('price')),
            description: String(formData.get('description') ?? ''),
            isNew: Boolean(formData.get('isNew') ?? false),
            category_id: String(formData.get('category_id')),
        })
        .eq('id', id);

    if (error) {
        console.log(error);
        return { success: false, errors: { alert: '저장에 실패하였습니다.' } };
    }

    return { success: true };
}

export async function deleteProduct(id: string) {
    const supabase = createServerClient();

    // TODO : 연결된 gid나 board 삭제

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        return { success: false, errors: { alert: '삭제에 실패하였습니다.' } };
    }

    return { success: true };
}
