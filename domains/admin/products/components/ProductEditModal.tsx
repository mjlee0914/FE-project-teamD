'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Product } from '@/domains/products/types/product.types';
import { MOCK_CATEGORY_ROWS } from '@/shared/mocks/mockData';
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

export interface ProductFormValues {
    name: string;
    description: string;
    category_id: string;
    isNew: boolean;
    price: number;
    imageFile: File | null;
}

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product; // 있으면 수정, 없으면 추가
    onSave: (values: ProductFormValues) => Promise<void>;
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function ProductImageInput({ product }: { product?: Product }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selection, setSelection] = useState<{
        file: File;
        url: string;
    } | null>(null);
    const [error, setError] = useState('');
    const preview = selection?.url ?? product?.imageUrl;

    useEffect(() => {
        if (!selection) return;
        return () => URL.revokeObjectURL(selection.url);
    }, [selection]);

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {preview && (
                <div className="relative mx-auto h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Image
                        src={preview}
                        alt={
                            selection
                                ? '선택한 상품 이미지 미리보기'
                                : '현재 상품 이미지'
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 90vw, 560px"
                        className="object-contain p-2"
                    />
                </div>
            )}
            <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                    {product?.imageUrl ? '교체할 이미지 선택' : '이미지 선택'}
                </span>
                <Input
                    ref={inputRef}
                    name="image"
                    type="file"
                    accept={IMAGE_TYPES.join(',')}
                    className="h-auto min-h-10 bg-white py-2"
                    aria-invalid={!!error}
                    aria-describedby="product-image-help product-image-error"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        setError('');
                        setSelection(null);
                        if (!file) return;
                        if (
                            !IMAGE_TYPES.includes(file.type) ||
                            file.size === 0 ||
                            file.size > MAX_IMAGE_SIZE
                        ) {
                            setError(
                                'JPG, PNG, WebP, GIF 이미지 파일을 5MB 이하로 선택해 주세요.',
                            );
                            event.target.value = '';
                            return;
                        }
                        setSelection({ file, url: URL.createObjectURL(file) });
                    }}
                />
            </label>
            <p id="product-image-help" className="text-xs text-gray-500">
                JPG, PNG, WebP, GIF · 최대 5MB · 이미지를 선택하지 않으면 기존
                이미지를 유지합니다.
            </p>
            <p
                id="product-image-error"
                role="alert"
                className="text-xs text-red-600"
            >
                {error}
            </p>
            {selection && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                    <span className="min-w-0 break-all">
                        {selection.file.name} ·{' '}
                        {(selection.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (inputRef.current) inputRef.current.value = '';
                            setSelection(null);
                            setError('');
                        }}
                    >
                        선택 취소
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function ProductModal({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductModalProps) {
    const isEdit = !!product;
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (saving) return;

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') ?? '').trim();
        const description = String(formData.get('description') ?? '').trim();
        const category_id = String(formData.get('category_id') ?? '').trim();
        const isNew = Boolean(formData.get('isNew'));
        const price = Number(formData.get('price'));
        const image = formData.get('image');
        const imageFile =
            image instanceof File && image.size > 0 ? image : null;

        if (
            !name ||
            !Number.isInteger(price) ||
            price < 0 ||
            !description ||
            !category_id
        ) {
            return;
        }

        setSaving(true);
        setSaveError('');
        try {
            await onSave({
                name,
                description,
                category_id,
                isNew,
                price,
                imageFile,
            });
            onOpenChange(false);
        } catch {
            setSaveError('저장하지 못했습니다. 다시 시도해 주세요.');
        } finally {
            setSaving(false);
        }
    }

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
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
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
                                        defaultValue={product?.name ?? ''}
                                        placeholder="상품명을 입력하세요"
                                        required
                                        maxLength={100}
                                    />
                                </label>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            판매 가격
                                        </span>
                                        <div className="relative">
                                            <Input
                                                name="price"
                                                type="number"
                                                defaultValue={
                                                    product?.price ?? ''
                                                }
                                                min={0}
                                                step={1}
                                                required
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
                                            defaultValue={
                                                product?.category_id ?? ''
                                            }
                                            required
                                            className="w-full"
                                        >
                                            <NativeSelectOption value="">
                                                카테고리 선택
                                            </NativeSelectOption>
                                            {MOCK_CATEGORY_ROWS.map(
                                                (category) => (
                                                    <NativeSelectOption
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </NativeSelectOption>
                                                ),
                                            )}
                                        </NativeSelect>
                                    </label>
                                </div>
                                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Checkbox
                                        name="isNew"
                                        defaultChecked={product?.isNew ?? false}
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
                                    defaultValue={product?.description ?? ''}
                                    required
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
                            <ProductImageInput
                                key={`${product?.id ?? 'new'}-${open}`}
                                product={product}
                            />
                        </section>
                    </div>
                    {saveError && (
                        <p
                            role="alert"
                            className="px-6 pb-3 text-sm text-red-600"
                        >
                            {saveError}
                        </p>
                    )}
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
                                  : '상품 추가'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
