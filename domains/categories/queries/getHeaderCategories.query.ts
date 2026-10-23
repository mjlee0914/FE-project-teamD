import { createServerClient } from '@/lib/supabase';
import type { Category } from '@/domains/categories/types/category.types';

export type HeaderCategory = Pick<Category, 'id' | 'name'>;

export async function getHeaderCategories(): Promise<HeaderCategory[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('category')
        .select('id, name')
        .is('deleted_at', null)
        .eq('type', 'MAIN')
        .eq('depth', 1)
        .or('parent_id.is.null,parent_id.eq.')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(`헤더 카테고리 조회 실패: ${error.message}`);
    }

    return data ?? [];
}
