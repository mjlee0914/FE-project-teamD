import ProductGrid from './ProductGrid';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function PopularProducts() {
    const recommendedProducts = MOCK_PRODUCTS.slice(2, 5);
    return (
        <>
            <section className="p-20">
                <div className="flex flex-col p-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        요즘 가장 많이 찾는 아이템
                    </h1>
                    <p className="text-s mt-1 text-gray-500">
                        지금 사랑받는 베스트 상품을 한눈에 확인해보세요.
                    </p>
                </div>
                <ProductGrid products={recommendedProducts} />
            </section>
        </>
    );
}
