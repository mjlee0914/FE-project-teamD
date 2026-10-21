import { createServerClient } from '@/lib/supabase';
import type { Product } from '@/domains/products/types/product.types';

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProductById(
    productId: string,
): Promise<Product | null> {
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

    return {
        id: data.id,
        gid: data.gid ?? '',
        name: data.name,
        price: data.price,
        category_id: data.category_id,
        description: data.description ?? '',
        isNew: data.isNew ?? false,
        viewCount: data.viewCount ?? 0,
        imageUrl: '/products/black-anorak.png',
    };
}

// 상품 id 여러 개일 때 쿼리 (게시판 목록의 상품 컬럼용)
export async function getProductnamesByIds(
    ids: string[],
): Promise<Record<string, string>> {
    // UUID 형식 아닌 값 오류 검증
    const validIds = [...new Set(ids)].filter((id) => uuidRegex.test(id));
    if (validIds.length === 0) return {};

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .in('id', validIds);

    if (error) {
        throw new Error(`상품명 조회 실패: ${error.message}`);
    }

    const names: Record<string, string> = {};
    for (const row of data ?? []) {
        if (row.name) names[row.id] = row.name;
    }
    return names;
}
