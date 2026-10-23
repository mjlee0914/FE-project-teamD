'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { addToCart } from '@/domains/cart/actions/addToCart.action';
import CartSuccessDialog from './CartSuccessDialog';
import type { Product } from '@/domains/products/types/product.types';

type ProductVariant = {
    color_name: string;
    color_hex: string;
    size: string;
    stock: number;
};

type SelectedOption = {
    key: string;
    color: string;
    size: string;
    quantity: number;
};

interface ProductDetailProps {
    product: Product;
    categoryName: string;
    variants: ProductVariant[];
}

export default function ProductDetail({
    product,
    categoryName,
    variants,
}: ProductDetailProps) {
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(
        [],
    );
    const [popupOpen, setPopupOpen] = useState(false);
    const [isAdding, startTransition] = useTransition();

    const colors = Array.from(
        new Map(
            variants.map((variant) => [variant.color_name, variant.color_hex]),
        ).entries(),
    ).map(([name, hex]) => ({ name, hex }));

    const selectedColor =
        colors.find((item) => item.name === color) ?? colors[0];
    const currentColor = selectedColor?.name ?? '';
    const sizes = Array.from(
        new Set(
            variants
                .filter((variant) => variant.color_name === currentColor)
                .map((variant) => variant.size),
        ),
    );

    const findVariant = (colorName: string, selectedSize: string) =>
        variants.find(
            (variant) =>
                variant.color_name === colorName &&
                variant.size === selectedSize,
        );

    function handleSelectSize(newSize: string) {
        const variant = findVariant(currentColor, newSize);
        if (!variant || variant.stock <= 0) return;
        setSize(newSize);
        const key = `${product.id}-${currentColor}-${newSize}`;
        setSelectedOptions((previous) =>
            previous.some((option) => option.key === key)
                ? previous
                : [
                      ...previous,
                      { key, color: currentColor, size: newSize, quantity: 1 },
                  ],
        );
    }

    function handleQuantityChange(key: string, change: number) {
        setSelectedOptions((previous) =>
            previous.map((option) => {
                if (option.key !== key) return option;
                const stock =
                    findVariant(option.color, option.size)?.stock ?? 0;
                return {
                    ...option,
                    quantity: Math.min(
                        Math.max(1, stock),
                        Math.max(1, option.quantity + change),
                    ),
                };
            }),
        );
    }

    function handleRemoveOption(key: string) {
        setSelectedOptions((previous) =>
            previous.filter((option) => option.key !== key),
        );
        setSize('');
    }

    function onClickCart() {
        if (selectedOptions.length === 0) {
            alert('옵션을 선택해 주세요.');
            return;
        }
        if (
            selectedOptions.some((option) => {
                const available =
                    findVariant(option.color, option.size)?.stock ?? 0;
                return available < option.quantity;
            })
        ) {
            alert(
                '품절 또는 재고 부족 옵션이 있어. 새로고침 후 다시 선택해 줘.',
            );
            return;
        }

        startTransition(async () => {
            // 기존 장바구니의 옵션 문자열 형식을 유지해.
            for (const option of selectedOptions) {
                const result = await addToCart(
                    product.id,
                    option.quantity,
                    `${option.color} / ${option.size}`,
                );
                if (!result.success) {
                    alert(result.message);
                    return;
                }
            }
            setPopupOpen(true);
        });
    }

    const totalPrice = selectedOptions.reduce(
        (total, option) => total + product.price * option.quantity,
        0,
    );

    return (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <section className="flex justify-center">
                <div className="w-full max-w-[400px]">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={500}
                        height={625}
                        unoptimized
                        className="block h-auto w-full"
                    />
                </div>
            </section>
            <section>
                <p className="mb-3 text-xs text-gray-400">
                    DN MALL / {categoryName}
                </p>
                <h1 className="text-2xl font-medium">{product.name}</h1>
                <div className="mt-5 flex items-center gap-3">
                    <span className="text-xl font-semibold">
                        {product.price.toLocaleString('ko-KR')}원
                    </span>
                </div>

                <div className="mt-10 border-t pt-6">
                    <div>
                        <h2 className="text-sm font-medium">
                            색상{' '}
                            <span className="ml-3 text-gray-500">
                                {currentColor || '옵션 준비 중'}
                            </span>
                        </h2>
                        <div className="mt-4 flex gap-3">
                            {colors.map((item) => (
                                <button
                                    type="button"
                                    key={item.name}
                                    onClick={() => {
                                        setColor(item.name);
                                        setSize('');
                                    }}
                                    aria-label={`${item.name} 선택`}
                                    aria-pressed={currentColor === item.name}
                                    className={`h-10 w-10 rounded-full border-2 p-1 ${currentColor === item.name ? 'border-black' : 'border-transparent'}`}
                                >
                                    <span
                                        className="block h-full w-full rounded-full border border-gray-200"
                                        style={{ backgroundColor: item.hex }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-10">
                        <h2 className="mb-4 text-sm font-medium">사이즈</h2>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((item) => {
                                const available =
                                    findVariant(currentColor, item)?.stock ?? 0;
                                return (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => handleSelectSize(item)}
                                        disabled={available === 0}
                                        title={
                                            available === 0
                                                ? '품절'
                                                : '선택 가능'
                                        }
                                        aria-pressed={size === item}
                                        className={`h-11 min-w-12 border px-3 text-sm ${size === item ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-100'} disabled:cursor-not-allowed disabled:line-through disabled:opacity-40`}
                                    >
                                        {item}
                                        {available === 0 ? ' (품절)' : ''}
                                    </button>
                                );
                            })}
                            {sizes.length === 0 && (
                                <p className="text-sm text-gray-400">
                                    등록된 사이즈가 없어.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {selectedOptions.length > 0 && (
                    <div className="mt-10 space-y-2">
                        {selectedOptions.map((option) => (
                            <div
                                key={option.key}
                                className="flex flex-wrap items-center gap-4 bg-[#F8F7F4] px-5 py-6"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                        {product.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        - {option.color} / {option.size}
                                    </p>
                                </div>
                                <div className="flex items-center border border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(option.key, -1)
                                        }
                                        disabled={option.quantity <= 1}
                                        className="h-10 w-10 disabled:cursor-not-allowed disabled:opacity-30"
                                        aria-label="수량 감소"
                                    >
                                        −
                                    </button>
                                    <span className="flex h-10 w-10 items-center justify-center border-x border-gray-200">
                                        {option.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(option.key, 1)
                                        }
                                        disabled={
                                            option.quantity >=
                                            (findVariant(
                                                option.color,
                                                option.size,
                                            )?.stock ?? 0)
                                        }
                                        className="h-10 w-10 disabled:cursor-not-allowed disabled:opacity-30"
                                        aria-label="수량 증가"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveOption(option.key)
                                    }
                                    className="text-xl text-gray-400 hover:text-black"
                                    aria-label="선택 옵션 삭제"
                                >
                                    ×
                                </button>
                                <p className="w-full text-right font-medium sm:w-28">
                                    {(
                                        product.price * option.quantity
                                    ).toLocaleString('ko-KR')}
                                    원
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-10 flex items-center justify-between border-t pt-6">
                    <span className="text-sm font-medium">총 상품 금액</span>
                    <span className="text-xl font-semibold">
                        {totalPrice.toLocaleString('ko-KR')}원
                    </span>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-4">
                    <button
                        type="button"
                        className="col-span-2 h-16 cursor-pointer bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#333333] active:bg-[#555555]"
                    >
                        BUY IT NOW
                    </button>
                    <button
                        type="button"
                        className="col-span-1 h-16 cursor-pointer border border-black bg-white text-base font-semibold text-black transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
                        onClick={onClickCart}
                        disabled={isAdding || variants.length === 0}
                    >
                        CART
                    </button>
                </div>
                <div className="mt-8 border-t py-6 text-sm">
                    <p className="font-medium">배송 및 교환 안내</p>
                    <a
                        href="#guide"
                        className="mt-2 inline-block text-gray-500 underline"
                    >
                        배송 및 교환 안내 자세히 보기
                    </a>
                </div>
                <div className="border-t py-8">
                    <h2 className="mb-4 font-semibold">상품 설명</h2>
                    <p className="text-sm leading-7 text-gray-600">
                        {product.description}
                    </p>
                </div>
            </section>
            <CartSuccessDialog open={popupOpen} onOpenChange={setPopupOpen} />
        </div>
    );
}
