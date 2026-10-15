'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import CategoryTable from '@/domains/admin/category/components/CategoryTable';
import CategoryModal from '@/domains/admin/category/components/CategoryEditModal';
import { useState, type FormEvent } from 'react';
import { Category } from '@/domains/categories/types/category.types';

export default function AdminCategoryPage() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >();

    function handleAdd() {
        setSelectedCategory(undefined);
        setOpen(true);
    }

    function handleEdit(category: Category) {
        setSelectedCategory(category);
        setOpen(true);
    }

    async function handleSave(values: {
        name: string;
        parent_id: string;
        sort_order: number;
    }) {
        console.log(values);
    }

    function handleDelete(category: Category) {
        console.log('삭제', category);
    }

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const keyword = String(formData.get('searchValue') ?? '');

        setSearchKeyword(keyword.trim());
    }

    function filterCategories(
        categories: Category[],
        keyword: string,
    ): Category[] {
        const query = keyword.trim().toLowerCase();

        if (!query) return categories;

        return categories.flatMap((category) => {
            // 본인이 일치하면 하위 카테고리도 함께 유지
            if (category.name.toLowerCase().includes(query)) {
                return [category];
            }

            // 본인이 일치하지 않으면 자식 검색
            const children = filterCategories(category.children ?? [], query);

            // 일치하는 자식이 있으면 부모와 함께 반환
            return children.length > 0 ? [{ ...category, children }] : [];
        });
    }

    const categories = filterCategories(MOCK_CATEGORIES, searchKeyword);

    return (
        <>
            <p className="text-3xl font-bold">카테고리 관리</p>
            <div className="p-3">
                <form className="flex flex-col gap-3" onSubmit={handleSearch}>
                    <div className="flex">
                        <span className="w-30">카테고리명</span>
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
                <CategoryTable
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searching={searchKeyword.trim().length > 0}
                />
            </div>

            <CategoryModal
                open={open}
                onOpenChange={setOpen}
                category={selectedCategory}
                onSave={handleSave}
            ></CategoryModal>
        </>
    );
}
