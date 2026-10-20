'use client';

import { useState, type FormEvent } from 'react';
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
import { CATEGORY_TYPES } from '../types/category.type';
import type { ActionState } from '@/shared/types/action.types';

interface CategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category; // 있으면 수정, 없으면 추가
    onSave: (formData: FormData) => Promise<ActionState>;
}

export default function CategoryModal({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryModalProps) {
    const isEdit = !!category;
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (saving) return;

        // 입력값은 검사하지 않고 그대로 서버에 전달합니다.
        const formData = new FormData(event.currentTarget);
        setSaving(true);
        setErrors({});

        try {
            const result = await onSave(formData);
            if (result.success) {
                onOpenChange(false);
            } else {
                setErrors(result.errors ?? { form: '저장에 실패했습니다.' });
            }
        } catch {
            setErrors({
                form: '서버에 연결하지 못했습니다. 다시 시도해주세요.',
            });
        } finally {
            setSaving(false);
        }
    }

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
                    onSubmit={handleSubmit}
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
                                defaultValue={category?.name ?? ''}
                            />
                        </label>
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
                                    defaultValue={category?.type ?? ''}
                                    className="w-full bg-white"
                                >
                                    <NativeSelectOption value="">
                                        구분 선택
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
                                        상위 카테고리 선택
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
                        </section>
                    </div>
                    <div
                        role="alert"
                        aria-live="polite"
                        className="space-y-1 px-6 text-sm text-red-600"
                    >
                        {Object.entries(errors).map(([field, message]) => (
                            <p key={field}>{message}</p>
                        ))}
                    </div>
                    <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving
                                ? '저장 중…'
                                : isEdit
                                  ? '변경사항 저장'
                                  : '카테고리 추가'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
