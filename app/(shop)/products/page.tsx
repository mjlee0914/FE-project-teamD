'use client';

import { Input } from '@/shared/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/shared/mocks/mockData';
import CategoryTree from '@/domains/categories/components/CategoryTree';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import { useState, type FormEvent, useRef } from 'react';

export default function ProductList() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const page = Number(searchParams.get('page') ?? 1);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [priceRange, setPriceRange] = useState<{
        min: number | null;
        max: number | null;
    }>({
        min: null,
        max: null,
    });
    const minPriceRef = useRef<HTMLInputElement>(null);
    const maxPriceRef = useRef<HTMLInputElement>(null);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const keyword = String(formData.get('searchValue') ?? '');

        setSearchKeyword(keyword.trim());
    }

    function handleApplyPrice() {
        const minInput = minPriceRef.current;
        const maxInput = maxPriceRef.current;

        if (!minInput || !maxInput) return;

        if (!minInput.reportValidity() || !maxInput.reportValidity()) return;

        const min = minInput.value === '' ? null : minInput.valueAsNumber;
        const max = maxInput.value === '' ? null : maxInput.valueAsNumber;

        if (min !== null && max !== null && min > max) {
            alert('최소 가격은 최대 가격보다 클 수 없습니다.');
            return;
        }

        setPriceRange({ min, max });
    }

    function handleResetPrice() {
        setPriceRange({ min: null, max: null });

        if (minPriceRef.current) minPriceRef.current.value = '';
        if (maxPriceRef.current) maxPriceRef.current.value = '';
    }

    const products = categoryId
        ? MOCK_PRODUCTS.filter((product) => product.category_id === categoryId)
        : MOCK_PRODUCTS;

    const searchProducts = searchKeyword
        ? products.filter((product) =>
              product.name.toLowerCase().includes(searchKeyword.toLowerCase()),
          )
        : products;

    const priceProducts = searchProducts.filter(
        (product) =>
            (priceRange.min === null || product.price >= priceRange.min) &&
            (priceRange.max === null || product.price <= priceRange.max),
    );

    const pageSize = 9;
    const totalPage = Math.ceil(priceProducts.length / pageSize);

    const startIndex = (page - 1) * pageSize;
    const pageProducts = priceProducts.slice(startIndex, startIndex + pageSize);

    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[15rem_minmax(0,1fr)]">
            {/* 좌측 메뉴 */}
            <aside>
                <CategoryTree
                    categories={MOCK_CATEGORIES}
                    selectedCategoryId={categoryId ?? undefined}
                />
                <div className="border-t border-gray-300 pt-4">
                    <h2 className="mb-4 font-semibold">필터</h2>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="minPrice"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                최소 가격
                            </label>

                            <div className="relative">
                                <input
                                    ref={minPriceRef}
                                    name="minPrice"
                                    type="number"
                                    min={0}
                                    step={1}
                                    inputMode="numeric"
                                    placeholder="0"
                                    className="h-11 w-full [appearance:textfield] rounded-md border border-gray-300 bg-white pr-10 pl-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                    원
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="maxPrice"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                최대 가격
                            </label>

                            <div className="relative">
                                <input
                                    ref={maxPriceRef}
                                    name="maxPrice"
                                    type="number"
                                    min={0}
                                    step={1}
                                    inputMode="numeric"
                                    placeholder="99,000"
                                    className="h-11 w-full [appearance:textfield] rounded-md border border-gray-300 bg-white pr-10 pl-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500">
                                    원
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                className="cursor-pointer border border-gray-300 pt-1 pr-3 pb-1 pl-3 text-xs font-bold"
                                onClick={handleResetPrice}
                            >
                                초기화
                            </button>
                            <button
                                type="button"
                                className="text-bold cursor-pointer border border-gray-300 bg-black pt-1 pr-3 pb-1 pl-3 text-xs text-white"
                                onClick={handleApplyPrice}
                            >
                                적용하기
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            <div className="min-w-0">
                {/* 검색영역 */}
                <section>
                    <form id="searchForm" onSubmit={handleSearch}>
                        <div className="relative w-full">
                            <Input
                                type="text"
                                className="h-12 rounded-full border-0 bg-gray-100 pr-12 pl-4 shadow-none focus-visible:ring-0"
                                placeholder="Search"
                                autoComplete="off"
                                name="searchValue"
                            />
                            <button type="submit" className="cursor-pointer">
                                <CiSearch className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-gray-500" />
                            </button>
                        </div>
                    </form>
                </section>
                {/* 상품 영역 */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pageProducts.length === 0 && (
                        <p className="col-span-full py-10 text-center text-gray-500">
                            상품이 없습니다.
                        </p>
                    )}
                    {pageProducts.map((product) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={product.id}
                            className="flex cursor-pointer flex-col items-center justify-center"
                        >
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={250}
                                height={250}
                                unoptimized
                            />
                            <div className="w-[250px] text-left">
                                {product.name}
                            </div>
                            <div className="text-bold w-[250px] text-left text-xl">
                                {formatPrice(product.price)}
                            </div>
                            <div className="w-[250px] text-left text-xs text-gray-400">
                                조회수 {product.viewCount}
                            </div>
                        </Link>
                    ))}
                </section>
                {/* 페이징 영역 */}
                <nav className="mt-[30px] flex justify-center">
                    {totalPage > 0 && (
                        <nav>
                            {Array.from(
                                { length: totalPage },
                                (_, index) => index + 1,
                            ).map((pageNumber) => (
                                <Link
                                    key={pageNumber}
                                    href={{
                                        pathname: '/products',
                                        query: {
                                            ...(categoryId
                                                ? { categoryId }
                                                : {}),
                                            page: pageNumber,
                                        },
                                    }}
                                    className={`rounded border px-3 py-2 ${page === pageNumber ? 'bg-black font-bold text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {pageNumber}
                                </Link>
                            ))}
                        </nav>
                    )}
                </nav>
            </div>
        </div>
    );
}
