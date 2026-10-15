import { notFound } from 'next/navigation';

import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

import ProductDetail from '@/domains/products/components/ProductDetail';
import ProductDescription from '@/domains/products/components/ProductDescription';
import ProductReviews from '@/domains/products/components/ProductReviews';
import ProductInquiries from '@/domains/products/components/ProductInquiries';

interface ProductPageProps {
    params: { id: string };
}

export default async function ProductPage({
    params,
}: ProductPageProps): Promise<React.JSX.Element> {
    // URL에서 상품 ID 가져오기
    const { id } = await params;

    // ID에 맞는 상품 데이터 찾기
    const product = MOCK_PRODUCTS.find((item) => item.id === Number(id));

    // 해당 상품 없으면 404
    if (!product) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            {/* 상품 이미지, 상품명, 가격, 옵션 */}
            <ProductDetail key={product.id} product={product} />

            {/* 하단 이동 메뉴 */}
            <nav className="mt-20 grid grid-cols-4 border-b border-gray-300">
                <a
                    href="#detail"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Detail
                </a>

                <a
                    href="#review"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Review
                </a>

                <a
                    href="#qna"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Q&A
                </a>

                <a
                    href="#guide"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Shopping Guide
                </a>
            </nav>

            {/* 브랜드 이미지 + 상품별 상세 이미지 */}
            <ProductDescription product={product} />

            {/* 리뷰 */}
            <ProductReviews productId={product.id} />

            {/* 문의사항 */}
            <ProductInquiries productId={product.id} />

            {/* 모든 상품 공통 배송 및 교환 안내 */}
            <section id="guide" className="mt-24 scroll-mt-28 border-t pt-12">
                <h2 className="mb-8 text-2xl font-semibold">SHOPPING GUIDE</h2>

                <div className="border-y border-gray-200 py-10">
                    <h3 className="font-medium">배송 안내</h3>

                    <p className="mt-3 text-sm text-gray-500">
                        배송 정책은 추후 안내됩니다.
                    </p>

                    <h3 className="mt-10 font-medium">교환 및 반품 안내</h3>

                    <p className="mt-3 text-sm text-gray-500">
                        교환 및 반품 정책은 추후 안내됩니다.
                    </p>
                </div>
            </section>
        </main>
    );
}
