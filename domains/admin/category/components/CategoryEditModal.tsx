'use client';

import { type FormEvent } from 'react';
import type { Category } from '@/domains/categories/types/category.types';
import {
    Dialog,
    DialogContent,
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        카테고리 {isEdit ? '수정' : '추가'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    key={category?.id ?? 'new'}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <label className="block space-y-2">
                        <span className="text-sm font-medium">카테고리명</span>
                        <Input
                            name="name"
                            defaultValue={category?.name ?? ''}
                            required
                            maxLength={100}
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">
                            상위 카테고리
                        </span>
                        <NativeSelect
                            name="parent_id"
                            defaultValue={category?.parent_id ?? ''}
                        >
                            <NativeSelectOption value="">
                                최상단 카테고리
                            </NativeSelectOption>
                            {MOCK_CATEGORY_ROWS.map((category) => (
                                <NativeSelectOption
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">표시 순서</span>
                        <Input
                            name="sort_order"
                            type="number"
                            defaultValue={category?.sort_order ?? 1}
                            min={1}
                            step={1}
                            required
                        />
                    </label>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            취소
                        </Button>
                        <Button type="submit">
                            {isEdit ? '수정' : '추가'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
