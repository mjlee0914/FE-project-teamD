'use client';

import ProductTable from '@/domains/admin/products/components/ProductTable';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';
import { useState, type FormEvent } from 'react';
import { Product } from '@/domains/products/types/product.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import ProductModal from '@/domains/admin/products/components/ProductEditModal';
import type { ProductFormValues } from '@/domains/admin/products/components/ProductEditModal';

export default function AdminProductsPage() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<
        Product | undefined
    >();

    function handleAdd() {
        setSelectedProduct(undefined);
        setOpen(true);
    }

    function handleEdit(product: Product) {
        setSelectedProduct(product);
        setOpen(true);
    }

    function handleDelete(product: Product) {
        console.log('삭제', product);
    }

    async function handleSave(values: ProductFormValues) {
        console.log('저장', values);
    }

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const keyword = String(formData.get('searchValue') ?? '');

        setSearchKeyword(keyword.trim());
    }

    const porducts = searchKeyword
        ? MOCK_PRODUCTS.filter((product) =>
              product.name
                  .toLowerCase()
                  .includes(searchKeyword.toLocaleLowerCase()),
          )
        : MOCK_PRODUCTS;

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold">상품 관리</h1>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAdd}
                    className="h-10 border-gray-300 bg-white"
                >
                    상품 추가
                </Button>
            </div>
            <form
                onSubmit={handleSearch}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="text-sm font-semibold text-gray-900">
                        상품 검색
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        상품명 전체 또는 일부로 검색할 수 있습니다.
                    </p>
                </div>
                <div className="p-5">
                    <label className="block space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            상품명
                        </span>
                        <Input
                            type="text"
                            name="searchValue"
                            className="h-10 border-gray-300 bg-white"
                        />
                    </label>
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-500">
                        검색어를 비우고 검색하면 전체 상품 목록을 조회합니다.
                    </p>
                    <Button
                        type="submit"
                        className="h-10 w-full bg-gray-800 px-6 text-white hover:bg-gray-700 sm:w-auto"
                    >
                        검색
                    </Button>
                </div>
            </form>
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">
                    검색 결과{' '}
                    <span className="ml-1 text-gray-950 tabular-nums">
                        {porducts.length}건
                    </span>
                </h2>
                <ProductTable
                    products={porducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <ProductModal
                open={open}
                onOpenChange={setOpen}
                product={selectedProduct}
                onSave={handleSave}
            ></ProductModal>
        </section>
    );
}
