'use client';

import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { LuShoppingCart, LuUser, LuSearch } from 'react-icons/lu';
import { PiListBold } from 'react-icons/pi';
import useCartStore from '../store/useCartStore';
import { MOCK_CATEGORIES } from '../mocks/mockData';

export default function Header() {
    const cartCount = useCartStore((state) => state.count);
    return (
        <>
            <header
                className={cn(
                    'backgrop-blur-md w-full bg-white/95 transition-all',
                )}
            >
                {/* 기본 모바일: h-14, px-4 / md 이상: h-16, px-6 */}
                <div className="mx-auto grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b px-4 md:h-16 md:px-6">
                    <nav className="justify-self-start">
                        <Link
                            href="/products"
                            aria-label="전체상품"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <PiListBold className="h-4 w-4 shrink-0" />
                        </Link>
                    </nav>
                    {/* 로고 영역 */}
                    <Link
                        href="/"
                        className="text-lg tracking-tight text-gray-900 transition-colors hover:text-blue-600 md:text-xl"
                    >
                        <span className="brand-logo font-semibold tracking-wide">
                            DN Mall
                        </span>
                    </Link>

                    {/* 네비게이션 영역 */}
                    <nav className="flex items-center gap-1 justify-self-end md:gap-3">
                        <Link
                            href="/search"
                            aria-label="상품검색"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <LuSearch className="h-4 w-4 shrink-0"></LuSearch>
                        </Link>
                        {/* 장바구니 링크 */}
                        <Link
                            href="/cart"
                            aria-label="장바구니"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <span>{cartCount}</span>
                            <LuShoppingCart className="h-4 w-4 shrink-0" />
                        </Link>

                        {/* 로그인 버튼 */}
                        <Link
                            href="/login"
                            aria-label="로그인"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <LuUser className="h-4 w-4 shrink-0" />
                        </Link>
                    </nav>
                </div>
            </header>

            <nav className="sticky top-0 z-50 w-full bg-white/70 p-0.5 text-base backdrop-blur-md transition-all">
                <div>
                    <div className="max-w-auto mx-auto flex justify-center gap-10 p-3 text-sm md:px-4">
                        {MOCK_CATEGORIES.map((category) => (
                            <Link
                                key={category.id}
                                href={{
                                    pathname: '/products',
                                    query: { categoryId: category.id },
                                }}
                            >
                                <span className="hover:text-orange-500">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
}
