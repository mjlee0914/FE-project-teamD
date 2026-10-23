'use client';

import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LuShoppingCart, LuUser } from 'react-icons/lu';
import { PiListBold } from 'react-icons/pi';
import type { HeaderCategory } from '@/domains/categories/queries/getHeaderCategories.query';
import { logout } from '@/domains/auth/actions/logout.action';

export default function Header({
    userName,
    cartCount,
    categories,
    isAdmin = false,
}: {
    userName: string | null;
    cartCount: number;
    categories: HeaderCategory[];
    isAdmin?: boolean;
}) {
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
                        className="text-lg tracking-tight text-gray-900 transition-colors md:text-xl"
                    >
                        <span className="brand-logo font-semibold tracking-wide">
                            DN Mall
                        </span>
                    </Link>

                    {/* 네비게이션 영역 */}
                    <nav className="flex items-center gap-1 justify-self-end md:gap-3">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex h-7 items-center rounded-full border border-gray-200 px-2.5 text-[11px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                            >
                                관리자 페이지
                            </Link>
                        )}
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
                        {userName ? (
                            <>
                                <span className="hidden h-10 items-center px-2.5 text-xs font-medium whitespace-nowrap text-gray-700 md:flex md:px-3 md:text-sm">
                                    {userName}님 환영합니다!!
                                </span>
                                {/* 정보수정 · 로그아웃: 작은 알약 모양 버튼 */}
                                <div className="flex items-center gap-1">
                                    <Link
                                        href="/mypage"
                                        className="flex h-7 items-center rounded-full border border-gray-200 px-2.5 text-[11px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                                    >
                                        정보수정
                                    </Link>
                                    <form action={logout}>
                                        <button
                                            type="submit"
                                            className="flex h-7 cursor-pointer items-center rounded-full bg-gray-900 px-2.5 text-[11px] font-medium whitespace-nowrap text-white transition-colors hover:bg-zinc-700"
                                        >
                                            로그아웃
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                aria-label="로그인"
                                className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                            >
                                <LuUser className="h-4 w-4 shrink-0" />
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <nav className="sticky top-0 z-50 w-full bg-white/70 p-0.5 text-base backdrop-blur-md transition-all">
                <div>
                    <div className="max-w-auto mx-auto flex justify-center gap-10 p-3 text-sm md:px-4">
                        {/* 주소를 읽는 부분(useSearchParams)은 Suspense 로 감싸야 빌드가 멈추지 않는다 */}
                        <Suspense
                            fallback={
                                <CategoryLinks
                                    categories={categories}
                                    activeId={null}
                                />
                            }
                        >
                            <ActiveCategoryLinks categories={categories} />
                        </Suspense>
                    </div>
                </div>
            </nav>
        </>
    );
}

// 주소(/products?categoryId=...)로 지금 보고 있는 카테고리를 알아낸다
function ActiveCategoryLinks({ categories }: { categories: HeaderCategory[] }) {
    const pathname = usePathname();
    const categoryId = useSearchParams().get('categoryId');
    const activeId = pathname === '/products' ? categoryId : null;

    return <CategoryLinks categories={categories} activeId={activeId} />;
}

function CategoryLinks({
    categories,
    activeId,
}: {
    categories: HeaderCategory[];
    activeId: string | null;
}) {
    return categories.map((category) => (
        <Link
            key={category.id}
            href={{
                pathname: '/products',
                query: { categoryId: category.id },
            }}
        >
            {/* 지금 보고 있는 카테고리만 빨간 글씨 */}
            <span
                className={
                    activeId === category.id
                        ? 'font-bold text-red-500'
                        : 'hover:text-zinc-500'
                }
            >
                {category.name}
            </span>
        </Link>
    ));
}
