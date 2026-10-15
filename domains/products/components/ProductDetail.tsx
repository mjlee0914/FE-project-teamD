
'use client';

import { useState } from 'react';
import Image from 'next/image';

// page.tsx에서 전달받을 상품 정보
interface ProductDetailProps {
    product: {
        id: number;
        name: string;
        price: number;
        category_id: string;
        imageUrl: string;
        description: string;
    };
}

export default function ProductDetail({ product }: ProductDetailProps) {
    // 사용자가 선택한 옵션 저장
    const [color, setColor] = useState('블랙');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    // 상품별 색상과 이미지 설정
    const colorsByProduct: Record<
        number,
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
                src: '/products/라임 옐로우 밑단 스트링 후드티.png'
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
                    DN MALL / {product.category_id.toUpperCase()}
                </p>

                {/* 상품명 */}
                <h1 className="text-2xl font-medium">
                    {product.name}
                </h1>

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
                                    onClick={() => setColor(item.name)}
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
                        <h2 className="mb-4 text-sm font-medium">
                            사이즈
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {sizes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setSize(item)}
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

                {/* 수량 선택 */}
                <div className="mt-10">
                    <h2 className="mb-4 text-sm font-medium">
                        수량
                    </h2>

                    <div className="flex items-center gap-4">

                        {/* 수량 감소 */}
                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((prev) =>
                                    Math.max(1, prev - 1)
                                )
                            }
                            className="h-10 w-10 border border-gray-300"
                        >
                            -
                        </button>

                        {/* 현재 수량 */}
                        <span className="w-8 text-center">
                            {quantity}
                        </span>

                        {/* 수량 증가 */}
                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((prev) => prev + 1)
                            }
                            className="h-10 w-10 border border-gray-300"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* 총 상품 금액 */}
                <div className="mt-10 flex items-center justify-between border-t pt-6">
                    <span className="text-sm font-medium">
                        총 상품 금액
                    </span>

                    <span className="text-xl font-semibold">
                        {(product.price * quantity).toLocaleString('ko-KR')}원
                    </span>
                </div>

                {/* 장바구니 버튼 */}
                <button
                    type="button"
                    disabled
                    className="mt-12 w-full bg-black py-4 text-sm font-medium text-white disabled:opacity-60"
                >
                    장바구니 담기
                </button>

                {/* 배송 및 교환 안내 */}
                <div className="mt-8 border-t py-6 text-sm">
                    <p className="font-medium">
                        배송 및 교환 안내
                    </p>

                    <a
                        href="#guide"
                        className="mt-2 inline-block text-gray-500 underline"
                    >
                        배송 및 교환 안내 자세히 보기
                    </a>
                </div>

                {/* 상품 설명 */}
                <div className="border-t py-8">
                    <h2 className="mb-4 font-semibold">
                        상품 설명
                    </h2>

                    <p className="text-sm leading-7 text-gray-600">
                        {product.description}
                    </p>
                </div>

            </section>
        </div>
    );
}
