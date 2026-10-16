
interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({
    productId,
}: ProductReviewsProps) {
    return (
        <section
            id="review"
            data-product-id={productId}
            className="mt-24 scroll-mt-28 border-t pt-12"
        >
            <h2 className="mb-8 text-2xl font-semibold">
                REVIEW
            </h2>

            <div className="border-y border-gray-200 py-16 text-center">
                <p className="text-sm text-gray-500">
                    아직 등록된 상품 리뷰가 없습니다.
                </p>
            </div>
        </section>
    );
}
