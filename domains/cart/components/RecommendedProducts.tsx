import ProductCard from '@/domains/home/components/ProductCard';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function RecommendedProducts() {
    return (
        <section className="mt-16">
            <h2 className="mb-4 text-lg font-bold">추천 상품</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {MOCK_PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
