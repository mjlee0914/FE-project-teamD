import { createServerClient } from '@/lib/supabase';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 상품 id 여러 개 → { id: 상품명 } (게시판 목록의 상품 컬럼용)
export async function getProductNamesByIds(
    ids: string[],
): Promise<Record<string, string>> {
    // UUID 형식이 아닌 값은 DB 조회에서 오류가 나므로 미리 거르고, 중복은 제거
    const validIds = [...new Set(ids)].filter((id) => UUID_REGEX.test(id));
    if (validIds.length === 0) return {};

    const supabase = await createServerClient();
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
