import ProductBoardSection from '@/domains/boards/components/ProductBoardSection';

interface ProductInquiriesProps {
    productId: string;
}

export default function ProductInquiries({ productId }: ProductInquiriesProps) {
    return (
        <section
            id="qna"
            data-product-id={productId}
            className="mt-24 scroll-mt-28 border-t pt-12"
        >
            <h2 className="mb-8 text-2xl font-semibold">Q&A</h2>

            <ProductBoardSection
                boardId="qna"
                productId={productId}
                emptyText="아직 등록된 상품 문의가 없습니다."
            />
        </section>
    );
}
