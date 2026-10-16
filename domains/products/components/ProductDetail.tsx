'use client';

import { useState } from 'react';
import Image from 'next/image';
import useCartStore from '@/shared/store/useCartStore';

import CartSuccessDialog from './CartSuccessDialog';
import type { Product } from '@/domains/products/types/product.types';

// page.tsx에서 전달받을 상품 정보
interface ProductDetailProps {
    product: Product;
    categoryName: string;
}

type SelectedOption = {
    key: string;
    color: string;
    size: string;
    quantity: number;
};

export default function ProductDetail({
    product,
    categoryName,
}: ProductDetailProps) {
    // 사용자가 선택한 옵션 저장
    const [color, setColor] = useState('블랙');
    const [size, setSize] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(
        [],
    );
    const [popupOpen, setPopupOpen] = useState(false);

    const setCartCount = useCartStore((state) => state.setCount);
    const cartCount = useCartStore((state) => state.count);

    // 상품별 색상과 이미지 설정
    const colorsByProduct: Record<
        string,
        { name: string; style: string; src: string }[]
    > = {
        // 1번: 아노락
        1: [
            {
                name: '블랙',
                style: 'bg-black',
                src: '/products/black-anorak.png',
            },
            {
                name: '카키',
                style: 'bg-[#646f52]',
                src: '/products/Kaki-anorak.png',
            },
        ],

        // 2번: 스트링 후드티
        2: [
            {
                name: '피치 오렌지',
                style: 'bg-orange-300',
                src: '/products/피치 오렌지 밑단 스트링 후드티.png',
            },
            {
                name: '라임 옐로우',
                style: 'bg-[#E3E272]',
                src: '/products/라임 옐로우 밑단 스트링 후드티.png',
            },
        ],

        // 3번: 파스텔 조거 팬츠
        3: [
            {
                name: '멀티컬러',
                style: 'bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-300',
                src: product.imageUrl,
            },
        ],

        // 4번: 옐로우 윈드브레이커
        4: [
            {
                name: '옐로우',
                style: 'bg-yellow-400',
                src: product.imageUrl,
            },
        ],

        // 5번: 스웨이드 스니커즈
        5: [
            {
                name: '브라운',
                style: 'bg-[#76523C]',
                src: product.imageUrl,
            },
        ],
    };

    // 현재 상품에 해당하는 색상 가져오기
    const colors = colorsByProduct[product.id] ?? [
        {
            name: '기본',
            style: 'bg-gray-400',
            src: product.imageUrl,
        },
    ];

    // 현재 선택된 색상 찾기
    const selectedColor =
        colors.find((item) => item.name === color) ?? colors[0];

    // 선택된 색상에 맞는 이미지
    const imageSrc = selectedColor.src;

    // 상품 종류에 따라 사이즈 구분
    const sizes =
        product.category_id === 'cat-shoes'
            ? ['230', '240', '250', '260', '270', '280']
            : ['S', 'M', 'L', 'XL'];

    // 사이즈 클릭 시 색상 + 사이즈 조합 추가
    const handleSelectSize = (newSize: string) => {
        setSize(newSize);

        const key = `${product.id}-${selectedColor.name}-${newSize}`;

        setSelectedOptions((prev) => {
            // 이미 추가되면 중복 추가 x
            if (prev.some((option) => option.key === key)) {
                return prev;
            }

            return [
                ...prev,
                {
                    key,
                    color: selectedColor.name,
                    size: newSize,
                    quantity: 1,
                },
            ];
        });
    };

    // 각 옵션의 수량 증가 / 감소
    const handleQuantityChange = (key: string, change: number) => {
        setSelectedOptions((prev) =>
            prev.map((option) =>
                option.key === key
                    ? {
                          ...option,
                          quantity: Math.max(1, option.quantity + change),
                      }
                    : option,
            ),
        );
    };

    // 선택한 옵션 삭제
    const handleRemoveOption = (key: string) => {
        setSelectedOptions((prev) =>
            prev.filter((option) => option.key !== key),
        );

        setSize('');
    };

    const onClickCart = () => {
        setCartCount(cartCount + 1);
        setPopupOpen(true);
    };

    // 선택한 모든 옵션의 총금액
    const totalPrice = selectedOptions.reduce(
        (total, option) => total + product.price * option.quantity,
        0,
    );

    return (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* 왼쪽: 상품 이미지 */}
            <section className="flex justify-center">
                <div className="w-full max-w-[500px]">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        width={500}
                        height={625}
                        unoptimized
                        className="block h-auto w-full"
                    />
                </div>
            </section>
            {/* 오른쪽: 상품 정보 */}
            <section>
                {/* 카테고리 */}
                <p className="mb-3 text-xs text-gray-400">
                    DN MALL / {categoryName}
                </p>

                {/* 상품명 */}
                <h1 className="text-2xl font-medium">{product.name}</h1>

                {/* 상품 가격 */}
                <div className="mt-5 flex items-center gap-3">
                    <span className="text-xl font-semibold">
                        {product.price.toLocaleString('ko-KR')}원
                    </span>
                </div>

                {/* 색상 및 사이즈 선택 영역 */}
                <div className="mt-10 border-t pt-6">
                    {/* 모든 상품 색상 선택 */}
                    <div>
                        <h2 className="text-sm font-medium">
                            색상
                            <span className="ml-3 text-gray-500">
                                {selectedColor.name}
                            </span>
                        </h2>

                        <div className="mt-4 flex gap-3">
                            {colors.map((item) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => {
                                        setColor(item.name);
                                        setSize('');
                                    }}
                                    aria-label={`${item.name} 선택`}
                                    aria-pressed={
                                        selectedColor.name === item.name
                                    }
                                    className={`h-10 w-10 rounded-full border-2 p-1 ${
                                        selectedColor.name === item.name
                                            ? 'border-black'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <span
                                        className={`block h-full w-full rounded-full ${item.style}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 모든 상품 사이즈 선택 */}
                    <div className="mt-10">
                        <h2 className="mb-4 text-sm font-medium">사이즈</h2>

                        <div className="flex flex-wrap gap-2">
                            {sizes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleSelectSize(item)}
                                    aria-pressed={size === item}
                                    className={`h-11 min-w-12 border px-3 text-sm ${
                                        size === item
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 bg-gray-100'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 선택한 상품 옵션 목록 */}
                {selectedOptions.length > 0 && (
                    <div className="mt-10 space-y-2">
                        {selectedOptions.map((option) => (
                            <div
                                key={option.key}
                                className="flex flex-wrap items-center gap-4 bg-[#F8F7F4] px-5 py-6"
                            >
                                {/* 상품명과 선택한 옵션 */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                        {product.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        - {option.color} / {option.size}
                                    </p>
                                </div>

                                {/* 옵션별 수량 변경 */}
                                <div className="flex items-center border border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(option.key, -1)
                                        }
                                        className="h-10 w-10"
                                        aria-label={`${option.color} ${option.size} 수량 감소`}
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
                                        className="h-10 w-10"
                                        aria-label={`${option.color} ${option.size} 수량 증가`}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* 선택한 옵션 삭제 */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveOption(option.key)
                                    }
                                    className="text-xl text-gray-400 hover:text-black"
                                    aria-label={`${option.color} ${option.size} 옵션 삭제`}
                                >
                                    ×
                                </button>

                                {/* 옵션별 금액 */}
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

                {/* 총 상품 금액 */}
                <div className="mt-10 flex items-center justify-between border-t pt-6">
                    <span className="text-sm font-medium">총 상품 금액</span>

                    <span className="text-xl font-semibold">
                        {totalPrice.toLocaleString('ko-KR')}원
                    </span>
                </div>

                {/* 구매 및 장바구니 버튼 */}
                <div className="mt-12 grid grid-cols-3 gap-4">
                    {/* 바로 구매 버튼 */}
                    <button
                        type="button"
                        className="col-span-2 h-16 cursor-pointer bg-[#171717] text-base font-semibold text-white transition-colors hover:bg-[#333333] active:bg-[#555555]"
                    >
                        BUY IT NOW
                    </button>

                    {/* 장바구니 버튼 */}
                    <button
                        type="button"
                        className="col-span-1 h-16 cursor-pointer border border-black bg-white text-base font-semibold text-black transition-colors hover:bg-gray-100 active:bg-gray-200"
                        onClick={onClickCart}
                    >
                        CART
                    </button>
                </div>

                {/* 배송 및 교환 안내 */}
                <div className="mt-8 border-t py-6 text-sm">
                    <p className="font-medium">배송 및 교환 안내</p>

                    <a
                        href="#guide"
                        className="mt-2 inline-block text-gray-500 underline"
                    >
                        배송 및 교환 안내 자세히 보기
                    </a>
                </div>

                {/* 상품 설명 */}
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
