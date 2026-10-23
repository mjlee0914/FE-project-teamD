'use client';

import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/domains/cart/types/cart.types';
import { useState, useTransition } from 'react';
import { removeCartItem } from '@/domains/cart/actions/removeCartItem.action';
import { updateCartQuantity } from '@/domains/cart/actions/updateCartQuantity.action';
import useCheckoutStore from '@/domains/orders/store/useCheckoutStore';

export default function CartItemList({
    initialItems,
}: {
    initialItems: CartItem[];
}) {
    const [items, setItems] = useState(initialItems);
    const router = useRouter();
    const setCheckoutItems = useCheckoutStore(
        (state) => state.setCheckoutItems,
    );

    const [isPending, startTransition] = useTransition();

    function changeQuantity(cartItemId: string, amount: number) {
        const target = items.find((item) => item.id === cartItemId);
        if (!target) return;
        const newQuantity = target.quantity + amount;
        if (newQuantity < 1 || newQuantity > 99) {
            alert('수량은 1~99까지 선택가능합니다.');
            return;
        }
        startTransition(async () => {
            const result = await updateCartQuantity(cartItemId, newQuantity);
            if (result.success) {
                setItems(
                    items.map((item) =>
                        item.id === cartItemId
                            ? { ...item, quantity: newQuantity }
                            : item,
                    ),
                );
            } else {
                alert(result.message);
            }
        });
    }

    function handleRemove(cartItemId: string) {
        startTransition(async () => {
            const result = await removeCartItem(cartItemId);
            if (result.success) {
                setItems(items.filter((item) => item.id !== cartItemId));
            } else {
                alert(result.message);
            }
        });
    }
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const discountPrice = 0; //향후 쿠폰 및 할인 적용시 변경예정
    const shippingFee = totalPrice === 0 || totalPrice >= 50000 ? 0 : 3000;
    const finalPrice = totalPrice - discountPrice + shippingFee;

    // 주문서 작성하기: 장바구니 목록을 체크아웃 저장소에 넘기고 이동
    function goCheckout() {
        setCheckoutItems(items);
        router.push('/checkout');
    }

    return (
        <div className="mx-auto max-w-5xl px-4">
            <h1 className="mb-6 text-center text-2xl font-bold">
                장바구니({items.length})
            </h1>
            {items.length === 0 && (
                <p className="py-20 text-center text-gray-500">
                    장바구니가 비었습니다.
                </p>
            )}
            <ul>
                {items.map((item) => {
                    return (
                        <li
                            className="flex items-center gap-6 border-b py-4"
                            key={item.id}
                        >
                            {item.product.imageUrl ? (
                                <Image
                                    className="h-24 w-24 shrink-0 md:h-36 md:w-36"
                                    src={item.product.imageUrl}
                                    alt="상품이미지"
                                    width={150}
                                    height={150}
                                    unoptimized
                                ></Image>
                            ) : (
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border md:h-36 md:w-36">
                                    <span className="text-gray-400">
                                        이미지 준비중
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <p className="font-medium md:flex-1">
                                    상 품 명: {item.product.name}
                                    {/* 옵션이 있을 때만 보여준다 */}
                                    {item.option && (
                                        <span className="block text-sm font-normal text-gray-500">
                                            옵션: {item.option}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-500">
                                    단 가: {formatPrice(item.product.price)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        type="button"
                                        disabled={isPending}
                                        onClick={() =>
                                            changeQuantity(item.id, -1)
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
                                        disabled={isPending}
                                        onClick={() =>
                                            changeQuantity(item.id, +1)
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
                                disabled={isPending}
                                onClick={() => handleRemove(item.id)}
                            >
                                ×
                            </Button>
                        </li>
                    );
                })}
            </ul>
            {items.length > 0 && (
                <div className="mt-10">
                    <div className="my-8 flex flex-wrap items-center justify-center gap-20 rounded-lg border p-10">
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-gray-500">상품 금액</p>
                            <p className="text-lg font-bold">
                                {formatPrice(totalPrice)}
                            </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            −
                        </span>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-gray-500">할인 금액</p>
                            <p className="text-lg font-bold">
                                {formatPrice(discountPrice)}
                            </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            +
                        </span>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-gray-500">배 송 비</p>
                            <p className="text-lg font-bold">
                                {formatPrice(shippingFee)}
                            </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            =
                        </span>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-gray-500">총 결제금액</p>
                            <p className="text-lg font-bold">
                                {formatPrice(finalPrice)}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={goCheckout}
                        className="h-12 w-full text-base"
                    >
                        주문서 작성하기
                    </Button>
                </div>
            )}
        </div>
    );
}
