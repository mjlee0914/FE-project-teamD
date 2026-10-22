// 체크아웃 주문 상품 목록, 읽기 전용

// 사용 기능:
// checkoutItems 읽기
// 상품 개수 계산
// 상품 목록 출력
// 상품별 금액 출력

// zustand hook 사용하므로 CSR
'use client';

import Image from 'next/image';
import { formatPrice } from '@/shared/utils/formatPrice';
import useCheckoutStore from '../store/useCheckoutStore';

export default function CheckoutOrderItems() {
    const checkoutItems = useCheckoutStore((state) => state.checkoutItems);

    const totalQuantity = checkoutItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <section className="border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                주문 상품 ({totalQuantity}개)
            </h2>

            {checkoutItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                    주문할 상품이 없습니다.
                </p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {checkoutItems.map(({ id, product, quantity, option }) => (
                        <li
                            key={id}
                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                        >
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border text-xs text-gray-400">
                                    이미지 준비중
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900">
                                    {product.name}
                                </p>
                                {option && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        옵션: {option}
                                    </p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    {formatPrice(product.price)} × {quantity}개
                                </p>
                            </div>

                            <p className="shrink-0 font-bold text-gray-900">
                                {formatPrice(product.price * quantity)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
