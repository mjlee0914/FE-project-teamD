import { createServerClient } from '@/lib/supabase';
import type { Product } from '@/domains/products/types/product.types';
import {
    DEFAULT_PRODUCT_IMAGE,
    getProductImageUrls,
} from '@/domains/products/queries/getProductImageUrls.query';

export async function getPopularProducts(): Promise<Product[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('products')
        .select(
            'id, name, price, description, category_id, gid, isNew, viewCount',
        )
        .not('name', 'is', null)
        .not('price', 'is', null)
        .order('viewCount', { ascending: false, nullsFirst: false })
        .limit(3);

    if (error) {
        throw new Error(`인기상품 조회 실패: ${error.message}`);
    }

    const rows = data ?? [];
    const imageUrls = await getProductImageUrls(rows.map((item) => item.gid));

    return rows.map((item) => ({
        id: item.id,
        gid: item.gid ?? 0,
        name: item.name,
        price: item.price,
        description: item.description ?? '',
        category_id: item.category_id ?? '',
        isNew: item.isNew ?? false,
        viewCount: item.viewCount ?? 0,
        imageUrl:
            item.gid == null
                ? DEFAULT_PRODUCT_IMAGE
                : (imageUrls.get(String(item.gid)) ?? DEFAULT_PRODUCT_IMAGE),
    }));
}
