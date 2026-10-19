import { createServerClient } from '@/lib/supabase';

export async function getProductById(productId: string) {
    // UUID 검증
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(productId)) {
        return null;
    }

    // Supabase 연결
    const supabase = createServerClient();

    // DB에서 상품 하나 조회
    const { data, error } = await supabase
        .from('products')
        .select(
            'id, gid, name, price, description, category_id, isNew, viewCount',
        )
        .eq('id', productId)
        .maybeSingle();

    // 조회 오류 처리
    if (error) {
        throw new Error(`상품 상세 조회 실패: ${error.message}`);
    }

    // 조회한 상품 반환 
    return data;
}
