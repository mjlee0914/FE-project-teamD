'use client';

import ShippingAddress from '@/domains/cart/components/ShippingAddress';
import { formatPrice } from '@/shared/utils/formatPrice';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

export default function CartItemList() {
    const [items, setItems] = useState(MOCK_CART_ITEMS);
    const [payMessage, setPayMessage] = useState<string | null>(null);

    function changeQuantity(id: number, amount: number) {
        setItems(
            items.map((item) =>
                item.product.id === id
                    ? {
                          ...item,
                          quantity: Math.min(
                              99,
                              Math.max(item.quantity + amount, 1),
                          ),
                      }
                    : item,
            ),
        );
    }

    function removeCartItem(id: number) {
        setItems(items.filter((item) => item.product.id !== id));
    }
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const shippingFee = totalPrice === 0 || totalPrice >= 50000 ? 0 : 3000;
    const finalPrice = totalPrice + shippingFee;

    function handlePay(formData: FormData) {
        const recipient = String(formData.get('recipient'));
        const phone = String(formData.get('phone'));
        const address = String(formData.get('address'));
        const addressDetail = String(formData.get('addressDetail'));

        if (
            recipient === '' ||
            phone === '' ||
            address === '' ||
            addressDetail === ''
        ) {
            setPayMessage('빈칸을 입력해 주세요');
            return;
        }

        setPayMessage(`${formatPrice(finalPrice)} 결제 완료!`);
    }

    return (
        <div className="mx-auto max-w-5xl px-4">
            {items.length === 0 && (
                <p className="py-20 text-center text-gray-500">
                    장바구니가 비었습니다.
                </p>
            )}
            <ul>
                {items.map((item) => {
                    return (
                        <li
                            className="flex items-center gap-6 border-b py-1"
                            key={item.product.id}
                        >
                            <Image
                                className="h-24 w-24 shrink-0 md:h-36 md:w-36"
                                src={item.product.imageUrl}
                                alt="상품이미지"
                                width={150}
                                height={150}
                                unoptimized
                            ></Image>
                            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <p className="font-medium md:flex-1">
                                    상 품 명: {item.product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    단 가: {formatPrice(item.product.price)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(item.product.id, -1)
                                        }
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(item.product.id, +1)
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                                <p className="font-bold md:ml-5 md:w-40 md:text-right">
                                    총 금액:{' '}
                                    {formatPrice(
                                        item.product.price * item.quantity,
                                    )}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                type="button"
                                onClick={() => removeCartItem(item.product.id)}
                            >
                                ×
                            </Button>
                        </li>
                    );
                })}
            </ul>
            {items.length > 0 && (
                <form action={handlePay}>
                    <ShippingAddress />
                    <div className="flex flex-col items-end gap-1 py-6">
                        <p>상품 금액: {formatPrice(totalPrice)}</p>
                        <p>배송비: {formatPrice(shippingFee)}</p>
                        <p className="text-lg font-bold">
                            총 결제 금액: {formatPrice(finalPrice)}
                        </p>
                    </div>
                    <Button type="submit" className="w-full">
                        결제하기
                    </Button>
                    {payMessage && (
                        <p className="py-4 text-center">{payMessage}</p>
                    )}
                </form>
            )}
        </div>
    );
}
