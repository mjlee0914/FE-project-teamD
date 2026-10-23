import { createServerClient } from '@/lib/supabase';
import type { Product } from '@/domains/products/types/product.types';
import {
    getProductImageUrls,
    DEFAULT_PRODUCT_IMAGE,
} from './getProductImageUrls.query';

export async function getProductById(
    productId: string,
): Promise<Product | null> {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(productId)) {
        return null;
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('products')
        .select(
            'id, name, price, description, category_id, gid, isNew, viewCount',
        )
        .eq('id', productId)
        .maybeSingle();

    if (error) {
        throw new Error(`상품 상세 조회 실패: ${error.message}`);
    }

    if (!data) {
        return null;
    }

    if (data.name == null || data.price == null) {
        throw new Error('상품명 또는 가격이 없습니다.');
    }

    // 공통 함수로 상품 이미지 조회
    const imageUrls = await getProductImageUrls([data.gid]);

    const imageUrl =
        data.gid == null
            ? DEFAULT_PRODUCT_IMAGE
            : (imageUrls.get(data.gid) ?? DEFAULT_PRODUCT_IMAGE);

    return {
        id: data.id,
        gid: data.gid ?? '',
        name: data.name,
        price: data.price,
        category_id: data.category_id,
        description: data.description ?? '',
        isNew: data.isNew ?? false,
        viewCount: data.viewCount ?? 0,
        imageUrl,
    };
}
