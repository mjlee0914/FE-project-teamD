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
        // ② 오른쪽에 고정, 큰 화면에서만
        <aside className="fixed top-40 right-6 z-40 hidden w-36 flex-col gap-3 lg:flex">
            <p className="text-sm font-semibold">추천 상품</p>

            {/* ③ 상품 카드 3개 */}
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex flex-col gap-1 rounded-lg border bg-white p-2 hover:shadow-md"
                >
                    {/* 이미지 자리 (장바구니처럼 "이미지 준비중") */}
                    <div className="flex aspect-square items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        이미지 준비중
                    </div>
                    <p className="truncate text-xs">{product.name}</p>
                    <p className="text-sm font-semibold">
                        {formatPrice(product.price)}
                    </p>
                </Link>
            ))}
        </aside>
    );
}
