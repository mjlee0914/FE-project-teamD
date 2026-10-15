'use client';

import { type FormEvent } from 'react';
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

import { MOCK_CATEGORY_ROWS } from '@/shared/mocks/mockData';

interface CategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category; // 있으면 수정, 없으면 추가
    onSave: (values: {
        name: string;
        parent_id: string;
        sort_order: number;
    }) => Promise<void>;
}

export default function CategoryModal({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryModalProps) {
    const isEdit = !!category;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') ?? '').trim();
        const parent_id = String(formData.get('parent_id') ?? '').trim();
        const sortOrder = Number(formData.get('sort_order'));

        if (!name || !Number.isInteger(sortOrder) || sortOrder < 1) {
            return;
        }

        await onSave({ name, parent_id, sort_order: sortOrder });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-12">
                    <DialogTitle className="text-xl">
                        카테고리 {isEdit ? '수정' : '추가'}
                    </DialogTitle>
                    <DialogDescription>
                        카테고리 이름과 상위 분류, 표시 순서를 설정하세요.
                    </DialogDescription>
                </DialogHeader>
                <form
                    key={category?.id ?? 'new'}
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-gray-700">
                                카테고리명
                            </span>
                            <Input
                                name="name"
                                defaultValue={category?.name ?? ''}
                                placeholder="예: 티셔츠"
                                required
                                maxLength={100}
                            />
                        </label>
                        <section
                            className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                            aria-label="분류 및 표시 설정"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">
                                분류 및 표시 설정
                            </h3>
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-gray-700">
                                    상위 카테고리
                                </span>
                                <NativeSelect
                                    name="parent_id"
                                    defaultValue={category?.parent_id ?? ''}
                                    className="w-full bg-white"
                                >
                                    <NativeSelectOption value="">
                                        없음 (최상위 카테고리)
                                    </NativeSelectOption>
                                    {MOCK_CATEGORY_ROWS.map((item) => (
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
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-gray-700">
                                    표시 순서
                                </span>
                                <Input
                                    name="sort_order"
                                    type="number"
                                    defaultValue={category?.sort_order ?? 1}
                                    min={1}
                                    step={1}
                                    required
                                    className="bg-white sm:max-w-32"
                                />
                                <span className="block text-xs text-gray-500">
                                    같은 상위 카테고리 안에서 숫자가 작을수록
                                    먼저 표시됩니다.
                                </span>
                            </label>
                        </section>
                    </div>
                    <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            취소
                        </Button>
                        <Button type="submit">
                            {isEdit ? '변경사항 저장' : '카테고리 추가'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
