import { createServerClient } from '@/lib/supabase';

interface GetCategoryProductsParams {
    categoryId?: string;
}

export async function getCategoryProducts({
    categoryId,
}: GetCategoryProductsParams = {}) {
    const supabase = createServerClient();

    let query = supabase
        .from('products')
        .select(
            'id, name, price, description, category_id, gid, isNew, viewCount',
        );

    if (categoryId?.trim()) {
        query = query.eq('category_id', categoryId.trim());
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`상품 목록 조회 실패: ${error.message}`);
    }

    return data ?? [];
}
