'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import CategoryTable from '@/domains/admin/category/components/CategoryTable';
import CategoryModal from '@/domains/admin/category/components/CategoryEditModal';
import { useState, type FormEvent, useEffect, useCallback } from 'react';
import {
    addCategory,
    getCategoryList,
    updateCategory,
} from '@/domains/admin/category/actions/category.action';
import type { ActionState } from '@/shared/types/action.types';
import { Category } from '@/domains/categories/types/category.types';
import { CATEGORY_TYPES } from '@/domains/admin/category/types/category.type';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/shared/components/ui/native-select';

export default function AdminCategoryPage() {
    const [search, setSearch] = useState({
        searchName: '',
        searchType: '',
    });
    const [categories, setCategories] = useState<Category[]>([]);

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

    async function handleSave(
        prevState: ActionState,
        formData: FormData,
    ): Promise<ActionState> {
        let result: ActionState;

        if (selectedCategory) {
            formData.set('id', selectedCategory.id);
            result = await updateCategory(prevState, formData);
        } else {
            result = await addCategory(prevState, formData);
        }

        if (result.success) {
            alert('저장되었습니다.');
            await loadCategories();
        }

        return result;
    }

    function handleDelete(category: Category) {
        console.log('삭제', category);
    }

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const searchName = String(formData.get('searchName') ?? '');
        const searchType = String(formData.get('searchType') ?? '');

        setSearch({ searchName: searchName, searchType: searchType });
    }

    const loadCategories = useCallback(async () => {
        const { data, error } = await getCategoryList(search);

        if (!error) {
            setCategories(data ?? []);
        } else {
            alert(error);
        }
    }, [search]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

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
                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <label className="min-w-0 space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            카테고리명
                        </span>
                        <Input
                            type="text"
                            name="searchName"
                            className="h-10 border-gray-300 bg-white"
                        />
                    </label>
                    <label className="min-w-0 space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            분류
                        </span>
                        <NativeSelect name="searchType">
                            <NativeSelectOption value="">
                                전체
                            </NativeSelectOption>
                            {CATEGORY_TYPES.map((item) => (
                                <NativeSelectOption
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
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
