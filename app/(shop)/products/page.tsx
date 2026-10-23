import { Suspense } from 'react';
import { getPagedProducts } from '@/domains/categories/queries/getCategoryProducts.query';
import { getCategories } from '@/domains/categories/queries/getCategories.query';
import type { Category } from '@/domains/categories/types/category.types';
import type { Product } from '@/domains/products/types/product.types';
import {
    getProductImageUrls,
    DEFAULT_PRODUCT_IMAGE,
} from '@/domains/products/queries/getProductImageUrls.query';
import ProductListClient from './ProductListClient';

type SearchParams = Record<string, string | string[] | undefined>;

interface ProductsPageProps {
    searchParams: Promise<SearchParams>;
}

function getParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function parsePrice(value?: string): number | null {
    if (!value?.trim()) return null;

    const price = Number(value);
    return Number.isSafeInteger(price) && price >= 0 ? price : null;
}

function getCategoryIds(categories: Category[], targetId: string): string[] {
    for (const category of categories) {
        if (category.id === targetId) {
            const collect = (item: Category): string[] => [
                item.id,
                ...(item.children ?? []).flatMap(collect),
            ];

            return collect(category);
        }

        const found = getCategoryIds(category.children ?? [], targetId);

        if (found.length > 0) return found;
    }

    return [];
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const params = await searchParams;

    const categoryId = getParam(params.categoryId);
    const keyword = getParam(params.keyword)?.trim();
    const minPrice = parsePrice(getParam(params.minPrice));
    const maxPrice = parsePrice(getParam(params.maxPrice));

    const rawPage = Number(getParam(params.page) ?? 1);
    const requestedPage =
        Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const categories = await getCategories();

    const categoryIds = categoryId
        ? getCategoryIds(categories, categoryId)
        : undefined;

    const filters = {
        categoryIds,
        keyword,
        minPrice,
        maxPrice,
    };

    const firstPageResult = await getPagedProducts({
        ...filters,
        page: 1,
    });

    const totalPages = Math.max(1, Math.ceil(firstPageResult.totalCount / 9));

    const currentPage = Math.min(requestedPage, totalPages);

    const result =
        currentPage === 1
            ? firstPageResult
            : await getPagedProducts({
                  ...filters,
                  page: currentPage,
              });

    // 현재 페이지 상품들의 이미지를 한 번에 조회
    const imageUrls = await getProductImageUrls(
        result.products.map((item) => item.gid),
    );
    const products: Product[] = result.products.flatMap((item): Product[] => {
        if (item.name == null || item.price == null) {
            return [];
        }

        return [
            {
                id: item.id,
                gid: item.gid ?? '',
                name: item.name,
                price: item.price,
                description: item.description ?? '',
                category_id: item.category_id,
                isNew: item.isNew ?? false,
                viewCount: item.viewCount ?? 0,
                imageUrl:
                    item.gid == null
                        ? DEFAULT_PRODUCT_IMAGE
                        : (imageUrls.get(item.gid) ?? DEFAULT_PRODUCT_IMAGE),
            },
        ];
    });

    return (
        <Suspense fallback={<p>상품 목록을 불러오는 중...</p>}>
            <ProductListClient
                dbProducts={products}
                dbCategories={categories}
                totalCount={result.totalCount}
                currentPage={currentPage}
            />
        </Suspense>
    );
}
