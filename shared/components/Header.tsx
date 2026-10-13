import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { LuShoppingCart, LuUser, LuSearch } from 'react-icons/lu';
import { PiListBold } from 'react-icons/pi';

export default function Header() {
    return (
        <>
            <header
                className={cn(
                    'backgrop-blur-md w-full bg-white/95 transition-all',
                )}
            >
                {/* 기본 모바일: h-14, px-4 / md 이상: h-16, px-6 */}
                <div className="mx-auto flex h-14 items-center justify-around px-4 md:h-16 md:px-6">
                    <nav>
                        {/* 전체 상품 링크: 2일차에 카테고리 GNB로 확장 */}
                        <Link
                            href="/products"
                            aria-label="전체 상품"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <PiListBold className="h-4 w-4 shrink-0" />
                            <span className="hidden md:inline"></span>
                        </Link>
                    </nav>
                    {/* 로고 영역 */}
                    <Link
                        href="/"
                        className="text-lg font-black tracking-tight text-gray-900 transition-colors hover:text-blue-600 md:text-xl"
                    >
                        DN Mall
                    </Link>

                    {/* 네비게이션 영역 */}
                    <nav className="flex items-center gap-1 md:gap-3">
                        <Link
                            href="/search"
                            aria-label="상품검색"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <LuSearch></LuSearch>
                        </Link>
                        {/* 장바구니 링크 */}
                        <Link
                            href="/cart"
                            aria-label="장바구니"
                            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                        >
                            <LuShoppingCart className="h-4 w-4 shrink-0" />
                            <span className="hidden md:inline"></span>
                        </Link>

                        {/* 로그인 버튼 */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-2.5 md:px-3"
                        >
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5"
                            >
                                <LuUser className="h-3.5 w-3.5" />
                                <span className="text-xs md:text-sm">
                                    로그인
                                </span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <nav className="sticky top-0 z-50 w-full bg-white/70 text-base backdrop-blur-md transition-all">
                <div>
                    <div className="max-w-auto mx-auto flex justify-center gap-30 p-3 text-sm md:px-4">
                        <Link href="">
                            <span>신상품</span>
                        </Link>
                        <Link href="">
                            <span>베스트셀러</span>
                        </Link>
                        <Link href="">
                            <span>상의</span>
                        </Link>
                        <Link href="">
                            <span>하의</span>
                        </Link>
                        <Link href="">
                            <span>신발</span>
                        </Link>
                        <Link href="">
                            <span className="text-red-600">세일상품</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
