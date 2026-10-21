import { Suspense } from 'react';
import { getCategoryProducts } from '@/domains/categories/queries/getCategoryProducts.query';
import type { Product } from '@/domains/products/types/product.types';
import ProductListClient from './ProductListClient';

export default async function ProductsPage() {
    
    const data = await getCategoryProducts();

    const products: Product[] = data.flatMap((item): Product[] => {
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
                imageUrl: '/products/black-anorak.png',
            },
        ];
    });


    return (
        <Suspense fallback={<p>상품 목록을 불러오는 중...</p>}>
            <ProductListClient dbProducts={products} />
        </Suspense>
    );
}
