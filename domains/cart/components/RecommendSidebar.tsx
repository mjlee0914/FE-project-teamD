import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/domains/products/types/product.types';
import { formatPrice } from '@/shared/utils/formatPrice';

export default function RecommendSidebar({
    products,
}: {
    products: Product[];
}) {
    // ① 추천할 게 없으면 아무것도 안 보여주기
    if (products.length === 0) return null;

    return (
        // ② 장바구니 바로 옆에 붙어서 스크롤을 따라온다 (큰 화면에서만)
        //    제목(장바구니 (n)) 높이만큼 내려서 카드 윗줄과 맞춘다
        <aside className="sticky top-24 mt-14 hidden w-60 shrink-0 flex-col gap-4 self-start border border-gray-100 p-5 shadow-sm lg:flex">
            <p className="text-lg font-bold text-gray-900">추천 상품</p>

            {/* ③ 상품 카드 3개 */}
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group flex flex-col gap-1"
                >
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={150}
                            height={150}
                            unoptimized
                            className="aspect-square w-full bg-gray-100 object-cover transition-opacity group-hover:opacity-80"
                        />
                    ) : (
                        <div className="flex aspect-square items-center justify-center bg-gray-100 text-xs text-gray-400">
                            이미지 준비중
                        </div>
                    )}
                    <p className="mt-1 truncate text-sm text-gray-600 group-hover:text-gray-900">
                        {product.name}
                    </p>
                    <p className="font-black text-gray-900">
                        {formatPrice(product.price)}
                    </p>
                </Link>
            ))}
        </aside>
    );
}
