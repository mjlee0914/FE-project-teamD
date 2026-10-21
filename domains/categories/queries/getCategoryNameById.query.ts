import { createServerClient } from '@/lib/supabase';

export async function getCategoryNameById(
    categoryId: string,
): Promise<string | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('category')
        .select('name')
        .eq('id', categoryId)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        throw new Error(`카테고리 조회 실패: ${error.message}`);
    }

    return data?.name ?? null;
}
