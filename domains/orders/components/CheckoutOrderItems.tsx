// 체크아웃 주문 상품 목록, 읽기 전용
import Image from 'next/image';
import type { CartItem } from '@/domains/cart/types/cart.types';
import { formatPrice } from '@/shared/utils/formatPrice';

interface CheckoutOrderItemsProps {
    items: CartItem[];
}

export default function CheckoutOrderItems({ items }: CheckoutOrderItemsProps) {
    const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                주문 상품 ({totalQuantity}개)
            </h2>

            {items.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                    주문할 상품이 없습니다.
                </p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {items.map(({ product, quantity }) => (
                        <li
                            key={product.id}
                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                        >
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="h-20 w-20 shrink-0 rounded-md object-cover"
                                unoptimized
                            />

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900">
                                    {product.name}
                                </p>
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
