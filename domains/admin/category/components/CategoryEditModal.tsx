'use client';

import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/domains/categories/types/category.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/shared/components/ui/native-select';

import { CATEGORY_TYPES } from '../types/category.type';
import {
    INITIAL_ACTION_STATE,
    type ActionState,
} from '@/shared/types/action.types';
import { getParentCategoryList } from '../actions/category.action';

interface CategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category; // 있으면 수정, 없으면 추가
    onSave: (
        prevState: ActionState,
        formData: FormData,
    ) => Promise<ActionState>;
}

export default function CategoryModal({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryModalProps) {
    const isEdit = !!category;
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(
        onSave,
        INITIAL_ACTION_STATE,
    );

    const [form, setForm] = useState<{
        name: string;
        parent_id: string;
        type: string;
    }>({
        name: category?.name ?? '',
        parent_id: category?.parent_id ?? '',
        type: category?.type ?? 'MAIN',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'type') {
            setForm((prev) => ({ ...prev, type: value, parent_id: '' }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };
    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
            router.refresh();
        }
    }, [state.success, onOpenChange, router]);

    useEffect(() => {
        async function loadCategories() {
            const { data, error } = await getParentCategoryList(form.type);

            if (error) {
                setErrorMessage('오류가 발생하였습니다.');
                return;
            }

            const items: Category[] = data ?? [];
            const excludedIds = new Set<string>();
            if (category) excludedIds.add(category.id);
            let changed = true;
            while (changed) {
                changed = false;
                for (const item of items) {
                    if (
                        item.parent_id &&
                        excludedIds.has(item.parent_id) &&
                        !excludedIds.has(item.id)
                    ) {
                        excludedIds.add(item.id);
                        changed = true;
                    }
                }
            }
            setCategories(items.filter((item) => !excludedIds.has(item.id)));
            setErrorMessage('');
        }
        loadCategories();
    }, [form.type, category]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-12">
                    <DialogTitle className="text-xl">
                        카테고리 {isEdit ? '수정' : '추가'}
                    </DialogTitle>
                    <DialogDescription>
                        카테고리 이름과 구분, 상위 분류를 설정하세요.
                    </DialogDescription>
                </DialogHeader>
                <form
                    key={category?.id ?? 'new'}
                    action={formAction}
                    noValidate
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-gray-700">
                                카테고리명
                            </span>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                            />
                        </label>
                        {state.errors?.name && (
                            <p className="text-red-600">{state.errors.name}</p>
                        )}
                        <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                분류 및 표시 설정
                            </h3>
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-gray-700">
                                    카테고리 구분
                                </span>
                                <NativeSelect
                                    name="type"
                                    value={form.type}
                                    onChange={onChange}
                                    className="w-full bg-white"
                                >
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
                            {state.errors?.type && (
                                <p className="text-red-600">
                                    {state.errors.type}
                                </p>
                            )}
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-gray-700">
                                    상위 카테고리
                                </span>
                                <NativeSelect
                                    name="parent_id"
                                    value={form.parent_id}
                                    onChange={onChange}
                                    className="w-full bg-white"
                                >
                                    <NativeSelectOption value="">
                                        없음 (최상위 카테고리)
                                    </NativeSelectOption>
                                    {categories.map((item) => (
                                        <NativeSelectOption
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                                <span className="block text-xs text-gray-500">
                                    선택한 카테고리 아래에 배치됩니다.
                                </span>
                            </label>
                            {state.errors?.parent_id && (
                                <p className="text-red-600">
                                    {state.errors.parent_id}
                                </p>
                            )}
                        </section>
                        {state.errors?.form && (
                            <p className="text-red-600">{state.errors.form}</p>
                        )}
                        {errorMessage && (
                            <p className="text-red-600">{errorMessage}</p>
                        )}
                    </div>
                    <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            저장
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
