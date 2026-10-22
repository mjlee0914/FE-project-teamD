import ProductGrid from './ProductGrid';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function PopularProducts() {
    const productsSelected = [...MOCK_PRODUCTS];

    productsSelected.sort((a, b) => {
        const viewsA = a.viewCount ?? 0;
        const viewsB = b.viewCount ?? 0;

        return viewsB - viewsA; // 조회수 높은 상품이 앞에 오도록
    });

    const popularProducts = productsSelected.slice(0, 3);
    return (
        <>
            <section className="p-20">
                <div className="flex flex-col gap-2 p-10">
                    <p className="tracking-widest text-zinc-500">
                        BEST SELLERS
                    </p>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        요즘 가장 많이 찾는 아이템
                    </h1>
                    <p className="text-s pt-3 text-gray-500">
                        지금 사랑받는 베스트 상품을 한눈에 확인해보세요.
                    </p>
                </div>
                <ProductGrid products={popularProducts} />
            </section>
        </>
    );
}
