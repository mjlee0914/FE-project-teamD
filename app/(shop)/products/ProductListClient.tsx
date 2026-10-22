'use client';

import { Input } from '@/shared/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import type { Product } from '@/domains/products/types/product.types';
import CategoryTree from '@/domains/categories/components/CategoryTree';
import Image from 'next/image';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/domains/categories/types/category.types';
import { useRef, type FormEvent } from 'react';

export default function ProductList({
    dbProducts,
    dbCategories,
    totalCount,
    currentPage,
}: {
    dbProducts: Product[];
    dbCategories: Category[];
    totalCount: number;
    currentPage: number;
}) {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const requestedPage = Number(searchParams.get('page') ?? 1);

    const router = useRouter();

    const minPriceRef = useRef<HTMLInputElement>(null);
    const maxPriceRef = useRef<HTMLInputElement>(null);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const keyword = String(formData.get('searchValue') ?? '').trim();

        const params = new URLSearchParams(searchParams.toString());

        if (keyword) {
            params.set('keyword', keyword);
        } else {
            params.delete('keyword');
        }

        params.delete('page');

        const query = params.toString();
        router.push(query ? `/products?${query}` : '/products');
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

        const params = new URLSearchParams(searchParams.toString());

        if (min === null) {
            params.delete('minPrice');
        } else {
            params.set('minPrice', String(min));
        }

        if (max === null) {
            params.delete('maxPrice');
        } else {
            params.set('maxPrice', String(max));
        }

        params.delete('page');

        const query = params.toString();
        router.push(query ? `/products?${query}` : '/products');
    }

    function handleResetPrice() {
        if (minPriceRef.current) minPriceRef.current.value = '';
        if (maxPriceRef.current) maxPriceRef.current.value = '';

        const params = new URLSearchParams(searchParams.toString());

        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('page');

        const query = params.toString();
        router.push(query ? `/products?${query}` : '/products');
    }

    const pageProducts = dbProducts;
    const totalPage = Math.ceil(totalCount / 9);
    const page = currentPage;

    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[15rem_minmax(0,1fr)]">
            {/* 좌측 메뉴 */}
            <aside>
                <CategoryTree
                    categories={dbCategories}
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
                                    key={searchParams.get('minPrice') ?? ''}
                                    defaultValue={
                                        searchParams.get('minPrice') ?? ''
                                    }
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
                                    key={searchParams.get('maxPrice') ?? ''}
                                    defaultValue={
                                        searchParams.get('maxPrice') ?? ''
                                    }
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
                                key={searchParams.get('keyword') ?? ''}
                                defaultValue={searchParams.get('keyword') ?? ''}
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
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    unoptimized
                                    sizes="(min-width: 1024px) 33vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="w-full text-left">
                                {product.name}
                            </div>
                            <div className="text-bold w-full text-left text-xl">
                                {formatPrice(product.price)}
                            </div>
                            <div className="w-full text-left text-xs text-gray-400">
                                조회수 {product.viewCount}
                            </div>
                        </Link>
                    ))}
                </section>
                {/* 페이징 영역 */}
                <nav className="mt-7.5 flex justify-center">
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
                                            ...Object.fromEntries(
                                                searchParams.entries(),
                                            ),
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
