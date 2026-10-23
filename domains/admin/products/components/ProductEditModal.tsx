'use client';

import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { Product } from '@/domains/products/types/product.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/shared/components/ui/native-select';
import { Category } from '@/domains/categories/types/category.types';
import { getCategoryListRaw } from '../../category/actions/category.action';
import { useRouter } from 'next/navigation';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import FileAttachment, {
    type AttachmentValue,
} from '@/shared/components/FileAttachment';
import { getProductAttachments } from '../actions/product.action';

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product; // 있으면 수정, 없으면 추가
    onSave: (
        prevState: ActionState,
        formData: FormData,
    ) => Promise<ActionState>;
}

export default function ProductModal({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductModalProps) {
    const isEdit = !!product;
    const productId = product?.id;
    const [form, setForm] = useState<{
        name: string;
        price: number;
        description: string;
        isNew: boolean;
        category_id: string;
    }>({
        name: product?.name ?? '',
        price: product?.price ?? 0,
        description: product?.description ?? '',
        isNew: product?.isNew ?? false,
        category_id: product?.category_id ?? '',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [attachments, setAttachments] = useState<AttachmentValue>({
        existingFiles: [],
        newFiles: [],
        deletedIds: [],
    });
    const [attachmentsLoading, setAttachmentsLoading] = useState(
        open && !!product,
    );
    const [attachmentsError, setAttachmentsError] = useState('');
    const [attachmentRetry, setAttachmentRetry] = useState(0);
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(
        onSave,
        INITIAL_ACTION_STATE,
    );

    const onChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
            router.refresh();
        }
    }, [state.success, onOpenChange, router]);

    useEffect(() => {
        if (!open || !productId) return;
        const currentProductId = productId;
        let cancelled = false;

        async function loadAttachments() {
            try {
                const result = await getProductAttachments(currentProductId);
                if (cancelled) return;
                if (result.error) {
                    setAttachmentsError(result.error);
                    return;
                }
                setAttachments((current) => ({
                    ...current,
                    existingFiles: result.data,
                }));
                setAttachmentsError('');
            } catch {
                if (!cancelled)
                    setAttachmentsError('상품 이미지를 불러오지 못했습니다.');
            } finally {
                if (!cancelled) setAttachmentsLoading(false);
            }
        }

        void loadAttachments();
        return () => {
            cancelled = true;
        };
    }, [open, productId, attachmentRetry]);

    useEffect(() => {
        async function loadCategory() {
            const { data, error } = await getCategoryListRaw('MAIN');

            if (error) {
                alert('오류가 발생하였습니다.');
                return;
            }

            setCategories(data ?? []);
        }
        loadCategory();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-12">
                    <DialogTitle className="text-xl">
                        상품 {isEdit ? '수정' : '추가'}
                    </DialogTitle>
                    <DialogDescription>
                        상품 정보와 판매 설정을 입력하세요.
                    </DialogDescription>
                </DialogHeader>
                <form
                    key={product?.id ?? 'new'}
                    action={(formData) => {
                        if (attachmentsLoading || attachmentsError) return;
                        attachments.newFiles.forEach((file) => {
                            formData.append('files', file);
                        });

                        formData.set(
                            'deletedIds',
                            JSON.stringify(attachments.deletedIds),
                        );

                        formAction(formData);
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <input
                        type="hidden"
                        name="gid"
                        value={product?.gid ?? ''}
                    />
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                        <section
                            className="space-y-4"
                            aria-label="상품 기본 정보"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">
                                기본 정보
                            </h3>
                            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        상품명
                                    </span>
                                    <Input
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        placeholder="상품명을 입력하세요"
                                        maxLength={100}
                                    />
                                </label>
                                {state.errors?.name && (
                                    <p className="text-red-600">
                                        {state.errors.name}
                                    </p>
                                )}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            판매 가격
                                        </span>
                                        <div className="relative">
                                            <Input
                                                name="price"
                                                type="number"
                                                value={form.price}
                                                onChange={onChange}
                                                min={0}
                                                step={1}
                                                placeholder="0"
                                                className="pr-9"
                                            />
                                            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500">
                                                원
                                            </span>
                                        </div>
                                    </label>
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            카테고리
                                        </span>
                                        <NativeSelect
                                            name="category_id"
                                            value={form.category_id}
                                            onChange={onChange}
                                            className="w-full"
                                        >
                                            <NativeSelectOption value="">
                                                카테고리 선택
                                            </NativeSelectOption>
                                            {categories.map((category) => (
                                                <NativeSelectOption
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                    </label>
                                </div>
                                {state.errors?.price && (
                                    <p className="text-red-600">
                                        {state.errors.price}
                                    </p>
                                )}
                                {state.errors?.category_id && (
                                    <p className="text-red-600">
                                        {state.errors.category_id}
                                    </p>
                                )}
                                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Checkbox
                                        name="isNew"
                                        checked={form.isNew}
                                        onCheckedChange={(checked) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                isNew: checked === true,
                                            }))
                                        }
                                        className="mt-0.5"
                                    />
                                    <span className="space-y-1">
                                        <span className="block text-sm font-medium text-gray-900">
                                            신상품으로 표시
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            신상품 표시 여부를 설정합니다.
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </section>
                        <section className="space-y-3" aria-label="상품 설명">
                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-gray-900">
                                    상품 설명
                                </span>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={onChange}
                                    rows={5}
                                    placeholder="소재, 핏, 특징 등 상품 설명을 입력하세요."
                                    className="block w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-gray-400 focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200"
                                />
                            </label>
                        </section>
                        <section className="space-y-3" aria-label="상품 이미지">
                            <h3 className="text-sm font-semibold text-gray-900">
                                상품 이미지
                            </h3>
                            <FileAttachment
                                value={attachments}
                                onChange={setAttachments}
                                disabled={
                                    isPending ||
                                    attachmentsLoading ||
                                    !!attachmentsError
                                }
                            />
                            {attachmentsLoading && (
                                <p
                                    role="status"
                                    className="text-sm text-gray-500"
                                >
                                    상품 이미지를 불러오는 중입니다.
                                </p>
                            )}
                            {attachmentsError && (
                                <div
                                    role="alert"
                                    className="space-y-2 text-sm text-red-600"
                                >
                                    <p>{attachmentsError}</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setAttachmentsLoading(true);
                                            setAttachmentsError('');
                                            setAttachmentRetry(
                                                (current) => current + 1,
                                            );
                                        }}
                                    >
                                        다시 불러오기
                                    </Button>
                                </div>
                            )}
                        </section>
                        {state.errors?.form && (
                            <p className="text-red-600">{state.errors.form}</p>
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
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                attachmentsLoading ||
                                !!attachmentsError
                            }
                        >
                            저장
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
