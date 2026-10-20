'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import CategoryTable from '@/domains/admin/category/components/CategoryTable';
import CategoryModal from '@/domains/admin/category/components/CategoryEditModal';
import { useState, type FormEvent } from 'react';
import { addCategory } from '@/domains/admin/category/actions/category.action';
import type { ActionState } from '@/shared/types/action.types';
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

    async function handleSave(formData: FormData): Promise<ActionState> {
        if (selectedCategory) {
            return {
                success: false,
                errors: { form: '수정 기능은 아직 연결되지 않았습니다.' },
            };
        }

        // 화면은 입력값을 전달하고 서버의 처리 결과를 받습니다.
        const result = await addCategory({ success: false }, formData);
        return result;
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
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold">카테고리 관리</h1>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAdd}
                    className="h-10 border-gray-300 bg-white"
                >
                    카테고리 추가
                </Button>
            </div>
            <form
                onSubmit={handleSearch}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="text-sm font-semibold text-gray-900">
                        카테고리 검색
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        하위 카테고리까지 검색하며, 해당 항목의 상위 분류도 함께
                        표시합니다.
                    </p>
                </div>
                <div className="p-5">
                    <label className="block space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            카테고리명
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
                        검색어를 비우고 검색하면 전체 카테고리 목록을
                        조회합니다.
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
                    검색 결과
                </h2>
                <CategoryTable
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searching={searchKeyword.trim().length > 0}
                />
            </div>

            <CategoryModal
                key={String(open) + (selectedCategory?.id ?? 'new')}
                open={open}
                onOpenChange={setOpen}
                category={selectedCategory}
                onSave={handleSave}
            ></CategoryModal>
        </section>
    );
}
