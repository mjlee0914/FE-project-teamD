import { createServerClientq } from "@/lib/supabase";

interface GetPagedProductsParams {
    categoryIds?: string[];
    keyword?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    page?: number;
}

export async function getPagedProducts({
    categoryIds,
    keyword,
    minPrice,
    maxPrice,
    page = 1,
}: GetPagedProductsParams = {}) {
    const supabase = createServerClient();
    const pageSize = 9;

    const safePage = Number.isSafeInteger(page) && page > 0 ? page : 1;

    if (categoryIds && categoryIds.length === 0) {
        return { products: [], totalCount: 0 };
    }

    let query = supabase
        .from('products')
        .select(
            'id, name, price, description, category_id, gid, isNew, viewCount',
            { count: 'exact' },
        )
        .not('name', 'is', null)
        .not('price', 'is', null)
        .order('id', { ascending: true });

    if (categoryIds) {
        query = query.in('category_id', categoryIds);
    }

    if (keyword?.trim()) {
        query = query.ilike('name', `%${keyword.trim()}%`);
    }

    if (minPrice != null) {
        query = query.gte('price', minPrice);
    }

    if (maxPrice != null) {
        query = query.lte('price', maxPrice);
    }

    const startIndex = (safePage - 1) * pageSize;

    const { data, error, count } = await query.range(
        startIndex,
        startIndex + pageSize - 1,
    );

    if (error) {
        throw new Error(`상품 목록 조회 실패: ${error.message}`);
    }

    return {
        products: data ?? [],
        totalCount: count ?? 0,
    };
}

export async function getCategoryProducts({
    categoryId,
}: { categoryId?: string } = {}) {
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
