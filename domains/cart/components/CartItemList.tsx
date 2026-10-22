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

    // 주문서(체크아웃)와 같은 모양: 굵은 제목 + 테두리 카드 + 회색 금액 카드 + 검은 둥근 버튼
    return (
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
            <h3 className="mb-6 text-2xl font-black text-gray-900">
                장바구니 ({items.length})
            </h3>
            {items.length === 0 && (
                <p className="rounded-xs border py-20 text-center text-sm text-gray-500">
                    장바구니가 비었습니다.
                </p>
            )}
            {items.length > 0 && (
                <section className="flex flex-col gap-2 rounded-xs border p-6">
                    <h2 className="text-lg font-bold">담은 상품</h2>
                    <ul className="divide-y divide-gray-100">
                        {items.map((item) => {
                            return (
                                <li
                                    className="flex items-center gap-6 py-4"
                                    key={item.id}
                                >
                                    {item.product.imageUrl ? (
                                        <Image
                                            className="h-24 w-24 shrink-0 rounded-lg object-cover md:h-32 md:w-32"
                                            src={item.product.imageUrl}
                                            alt="상품이미지"
                                            width={150}
                                            height={150}
                                            unoptimized
                                        ></Image>
                                    ) : (
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 md:h-32 md:w-32">
                                            <span className="text-xs text-gray-400">
                                                이미지 준비중
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                        <p className="font-bold text-gray-900 md:flex-1">
                                            {item.product.name}
                                            {/* 옵션이 있을 때만 보여준다 */}
                                            {item.option && (
                                                <span className="mt-1 block text-xs font-normal text-gray-500">
                                                    옵션: {item.option}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            단가{' '}
                                            {formatPrice(item.product.price)}
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
                                            <span className="w-10 text-center text-sm">
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
                                        <p className="font-black text-gray-900 md:ml-5 md:w-32 md:text-right">
                                            {formatPrice(
                                                item.product.price *
                                                    item.quantity,
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
                </section>
            )}
            {items.length > 0 && (
                <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg border border-gray-100 bg-gray-50/80 p-6 shadow-sm md:gap-12">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-gray-600">상품 금액</p>
                            <p className="font-semibold text-gray-900">
                                {formatPrice(totalPrice)}
                            </p>
                        </div>
                        <span className="flex size-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                            −
                        </span>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-gray-600">할인 금액</p>
                            <p className="font-semibold text-gray-900">
                                {formatPrice(discountPrice)}
                            </p>
                        </div>
                        <span className="flex size-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                            +
                        </span>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-gray-600">배송비</p>
                            <p className="font-semibold text-gray-900">
                                {formatPrice(shippingFee)}
                            </p>
                        </div>
                        <span className="flex size-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                            =
                        </span>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs font-bold text-gray-900">
                                총 결제금액
                            </p>
                            <p className="text-xl font-black text-blue-600">
                                {formatPrice(finalPrice)}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={goCheckout}
                        className="h-12 w-full rounded-2xl bg-black font-bold text-white hover:bg-zinc-700"
                    >
                        주문서 작성하기
                    </Button>
                </div>
            )}
        </div>
    );
}
