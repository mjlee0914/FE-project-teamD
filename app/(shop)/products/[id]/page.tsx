'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

export default function ProductPage() {
    // URL에서 상품 ID 가져오기
    const params = useParams<{ id: string }>();

    // ID에 맞는 상품 찾기
    const product = MOCK_PRODUCTS.find(
        (item) => item.id === Number(params.id)
    );

    // 상품이 없을 때
    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }
    // 사용자가 선택한 옵션 저장
    const [color, setColor] = useState('블랙');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const colors = [
        { name: '블랙', style: 'bg-[#000000]' },
        { name: '카키', style: 'bg-[#646f52]' },
    ];

    const sizes = ['S', 'M', 'L', 'XL'];

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* 왼쪽: 상품 이미지 */}
                <section>
                    <div className="relative aspect-[3/4] w-full bg-gray-100">
                        <Image
                            src="/products/black-anorak.png"
                            alt="블랙 아노락 재킷"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* 오른쪽: 상품 정보 */}
                <section>
                    <p className="mb-3 text-xs text-gray-400">
                        DN MALL / OUTER
                    </p>

                    {/* 상품명 */}
                    <h1 className="text-2xl font-medium">{product.name}</h1>

                    {/* 가격 */}
                    <div className="mt-5 flex items-center gap-3">

                        <span className="text-xl font-semibold">
                            {product.price.toLocaleString()}원
                        </span>
                    </div>

                    {/* 색상 선택 */}
                    <div className="mt-10 border-t pt-6">
                        <h2 className="text-sm font-medium">
                            색상
                            <span className="ml-3 text-gray-500">{color}</span>
                        </h2>

                        <div className="mt-4 flex gap-3">
                            {colors.map((item) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setColor(item.name)}
                                    aria-label={`${item.name} 선택`}
                                    aria-pressed={color === item.name}
                                    className={`h-10 w-10 rounded-full border-2 p-1 ${
                                        color === item.name
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

                    {/* 사이즈 선택 */}
                    <div className="mt-10">
                        <h2 className="mb-4 text-sm font-medium">사이즈</h2>

                        <div className="flex gap-2">
                            {sizes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setSize(item)}
                                    aria-pressed={size === item}
                                    className={`h-11 w-12 border text-sm ${
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

                    {/* 수량 선택 */}
                    <div className="mt-10">
                        <h2 className="mb-4 text-sm font-medium">수량</h2>

                        <div className="flex items-center gap-4">
                            {/* 수량 감소 버튼 */}
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                className="h-10 w-10 border border-gray-300"
                            >
                                -
                            </button>

                            {/* 현재 수량 */}
                            <span className="w-8 text-center">{quantity}</span>

                            {/* 수량 증가 버튼 */}
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
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
                            {(product.price * quantity).toLocaleString('ko-KR')}
                            원
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

                    <p className="mt-3 text-xs text-gray-400"></p>

                    {/* 배송 안내 */}
                    <div className="mt-8 border-t py-6 text-sm">
                        <p className="font-medium">배송 및 교환 안내</p>
                        <p className="mt-2 text-gray-500"></p>
                    </div>

                    {/* 상품 설명 */}
                    <div className="border-t py-8">
                        <h2 className="mb-4 font-semibold">상품 설명</h2>

                        <p className="text-sm leading-7 text-gray-600">
                            {product.description}
                        </p>
                    </div>
                </section>
            </div>

            {/* 리뷰, Q&A 등등 이동 메뉴*/}

            <nav className="mt-20 grid grid-cols-4 border-b border-gray-300">
                <a
                    href="#detail"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Detail
                </a>

                <a
                    href="#review"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Review
                </a>

                <a
                    href="#qna"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Q&A
                </a>

                <a
                    href="#guide"
                    className="border-b-2 border-transparent py-5 text-center text-sm hover:border-black md:text-lg"
                >
                    Shopping Guide
                </a>
            </nav>

            {/* 상품 상세 이미지 */}
            <section className="mx-auto mt-20 max-w-3xl border-t pt-12">
                <h2 className="mb-10 text-center text-xl font-semibold">
                    상품 상세정보
                </h2>
                <Image
                    src="/products/DN Mall 로고.png"
                    alt="DM MALL 로고 이미지"
                    width={460}
                    height={1000}
                    className="h-auto w-full"
                />

                <Image
                    src="/products/anorak.gif"
                    alt="블랙 및 카키 아노락 상세 이미지"
                    width={800}
                    height={1000}
                    unoptimized
                    className="h-auto w-full"
                />
            </section>
        </main>
    );
}
