import { createServerClient } from '@/lib/supabase';
import type { Category } from '@/domains/categories/types/category.types';

export async function getCategories(): Promise<Category[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('category')
        .select('id,parent_id, name, depth, sort_order')
        .is('deleted_at', null)
        .in('type', ['MAIN', 'TEST'])
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error('카테고리 조회 실패: ${error.message}');
    }
    const categoryMap = new Map<string, Category>();

    for (const row of data ?? []) {
        if (!row.id || !row.name) continue;

        categoryMap.set(row.id, {
            id: row.id,
            parent_id: row.parent_id ?? null,
            name: row.name,
            depth: row.depth ?? 0,
            sort_order: row.sort_order ?? 0,
            children: [],
        });
    }

    const roots: Category[] = [];

    for (const category of categoryMap.values()) {
        const parent = category.parent_id
            ? categoryMap.get(category.parent_id)
            : undefined;

        if (parent && parent.id !== category.id) {
            parent.children?.push(category);
        } else {
            roots.push(category);
        }
    }

    return roots;
}
