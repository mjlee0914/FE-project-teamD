import ProductGrid from './ProductGrid';
import { getPopularProducts } from '../queries/getPopularProducts.query';

export default async function PopularProducts() {
    const popularProducts = await getPopularProducts();

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
