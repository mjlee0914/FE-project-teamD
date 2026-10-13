import ProductGrid from './ProductGrid';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function PopularProducts() {
    const recommendedProducts = MOCK_PRODUCTS.slice(2, 5);
    return (
        <>
            <section className="p-20">
                <div className="flex flex-col p-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        지금 가장 주목받는 추천 상품
                    </h1>
                    <p className="text-s mt-1 text-gray-500">
                        카테고리별 베스트셀러 아이템 모음
                    </p>
                </div>
                <ProductGrid products={recommendedProducts} />
            </section>
        </>
    );
}
