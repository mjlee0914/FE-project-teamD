'use client';

import ProductTable from '@/domains/admin/products/components/ProductTable';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';
import { useState, type FormEvent } from 'react';
import { Product } from '@/domains/products/types/product.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import ProductModal from '@/domains/admin/products/components/ProductEditModal';

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

    async function handleSave(values: {
        name: string;
        description: string;
        category_id: string;
        isNew: boolean;
        price: number;
    }) {
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
        <>
            <p className="text-3xl font-bold">상품 관리</p>
            <div className="p-3">
                <form className="flex flex-col gap-3" onSubmit={handleSearch}>
                    <div className="flex">
                        <span className="w-30">상품명</span>
                        <Input type="text" name="searchValue"></Input>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" onClick={handleAdd}>
                            추가
                        </Button>
                        <Button type="submit">검색</Button>
                    </div>
                </form>
            </div>
            <div>
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
        </>
    );
}
