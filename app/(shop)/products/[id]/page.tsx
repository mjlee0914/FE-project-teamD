import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { getCategoryNameById } from '@/domains/categories/queries/getCategoryNameById.query';
import { getProductById } from '@/domains/products/queries/getProductById.query';

import ProductDetail from '@/domains/products/components/ProductDetail';
import ProductDescription from '@/domains/products/components/ProductDescription';
import ProductReviews from '@/domains/products/components/ProductReviews';
import ProductInquiries from '@/domains/products/components/ProductInquiries';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({
    params,
}: ProductPageProps): Promise<React.JSX.Element> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) notFound();

    const categoryName =
        (await getCategoryNameById(product.category_id)) ?? '카테고리';

    const supabase = await createServerClient();
    const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select('color_name,color_hex,size,stock')
        .eq('product_id', product.id)
        .order('color_name')
        .order('size');

    if (variantsError) {
        console.error('상품 옵션 조회 실패:', variantsError.message);
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <ProductDetail
                key={product.id}
                product={product}
                categoryName={categoryName}
                variants={variants ?? []}
            />

            <nav className="mt-20 grid grid-cols-4 border-b border-gray-300">
                <a href="#detail" className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg">Detail</a>
                <a href="#review" className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg">Review</a>
                <a href="#qna" className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg">Q&amp;A</a>
                <a href="#guide" className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg">Shopping Guide</a>
            </nav>

            <ProductDescription product={product} />
            <ProductReviews productId={product.id} />
            <ProductInquiries productId={product.id} />

            <section id="guide" className="mt-24 scroll-mt-28 border-t pt-12">
                <h2 className="mb-8 text-2xl font-semibold">SHOPPING GUIDE</h2>
                <div className="border-y border-gray-200 py-10">
                    <h3 className="font-medium">배송 안내</h3>
                    <p className="mt-3 text-sm text-gray-500">배송 정책은 추후 안내됩니다.</p>
                    <h3 className="mt-10 font-medium">교환 및 반품 안내</h3>
                    <p className="mt-3 text-sm text-gray-500">교환 및 반품 정책은 추후 안내됩니다.</p>
                </div>
            </section>
        </main>
    );
}
