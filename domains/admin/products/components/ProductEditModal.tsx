'use client';

import { type FormEvent } from 'react';
import { Product } from '@/domains/products/types/product.types';
import { MOCK_CATEGORY_ROWS } from '@/shared/mocks/mockData';
import {
    Dialog,
    DialogContent,
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

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product; // 있으면 수정, 없으면 추가
    onSave: (values: {
        name: string;
        description: string;
        category_id: string;
        isNew: boolean;
        price: number;
    }) => Promise<void>;
}

export default function ProductModal({
    open,
    onOpenChange,
    product,
    onSave,
}: ProductModalProps) {
    const isEdit = !!product;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') ?? '').trim();
        const description = String(formData.get('description'));
        const category_id = String(formData.get('category_id') ?? '').trim();
        const isNew = Boolean(formData.get('isNew'));
        const price = Number(formData.get('price'));

        if (
            !name ||
            !Number.isInteger(price) ||
            price < 0 ||
            !description ||
            !category_id ||
            !isNew
        ) {
            return;
        }

        await onSave({ name, description, category_id, isNew, price });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>상품 {isEdit ? '수정' : '추가'}</DialogTitle>
                </DialogHeader>

                <form
                    key={product?.id ?? 'new'}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <label className="block space-y-2">
                        <span className="text-sm font-medium">상품 이미지</span>
                        첨부파일 미구현
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">상품명</span>
                        <Input
                            name="name"
                            defaultValue={product?.name ?? ''}
                            required
                            maxLength={100}
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">가격</span>
                        <Input
                            name="price"
                            type="number"
                            defaultValue={product?.price ?? ''}
                            required
                            maxLength={100}
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">설명</span>
                        <Input
                            name="description"
                            defaultValue={product?.description ?? ''}
                        />
                    </label>

                    <label className="block flex content-center space-y-2">
                        <Checkbox name="isNew" />
                        &nbsp;
                        <span className="text-sm font-medium">신상품 여부</span>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">카테고리</span>
                        <NativeSelect
                            name="category_id"
                            defaultValue={product?.category_id ?? ''}
                        >
                            <NativeSelectOption value="">
                                카테고리 선택
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
