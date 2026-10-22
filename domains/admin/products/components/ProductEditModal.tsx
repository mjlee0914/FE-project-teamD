'use client';

import { useActionState, useEffect, useState, type ChangeEvent } from 'react';
import type { Product } from '@/domains/products/types/product.types';
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
import { NativeSelect, NativeSelectOption } from '@/shared/components/ui/native-select';
import type { Category } from '@/domains/categories/types/category.types';
import { getCategoryListRaw } from '../../category/actions/category.action';
import { useRouter } from 'next/navigation';
import { type ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import ProductVariantsEditor from './ProductVariantsEditor';

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    onSave: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function ProductModal({ open, onOpenChange, product, onSave }: ProductModalProps) {
    const isEdit = !!product;
    const [form, setForm] = useState({
        name: product?.name ?? '',
        price: product?.price ?? 0,
        description: product?.description ?? '',
        isNew: product?.isNew ?? false,
        category_id: product?.category_id ?? '',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(onSave, INITIAL_ACTION_STATE);

    useEffect(() => {
        setForm({
            name: product?.name ?? '',
            price: product?.price ?? 0,
            description: product?.description ?? '',
            isNew: product?.isNew ?? false,
            category_id: product?.category_id ?? '',
        });
    }, [product]);

    useEffect(() => {
        if (state.success) {
            onOpenChange(false);
            router.refresh();
        }
    }, [state.success, onOpenChange, router]);

    useEffect(() => {
        async function loadCategories() {
            const { data, error } = await getCategoryListRaw('MAIN');
            if (error) {
                console.error('카테고리 조회 실패:', error.message);
                return;
            }
            setCategories(data ?? []);
        }
        void loadCategories();
    }, []);

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-12">
                    <DialogTitle className="text-xl">상품 {isEdit ? '수정' : '추가'}</DialogTitle>
                    <DialogDescription>상품 정보와 판매 설정을 입력하세요.</DialogDescription>
                </DialogHeader>
                <form key={product?.id ?? 'new'} action={formAction} className="flex min-h-0 flex-1 flex-col">
                    {product && <input type="hidden" name="id" value={product.id} />}
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                        <section className="space-y-4" aria-label="상품 기본 정보">
                            <h3 className="text-sm font-semibold text-gray-900">기본 정보</h3>
                            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium text-gray-700">상품명</span>
                                    <Input name="name" value={form.name} onChange={onChange} placeholder="상품명을 입력하세요" maxLength={100} />
                                </label>
                                {state.errors?.name && <p className="text-red-600">{state.errors.name}</p>}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-gray-700">판매 가격</span>
                                        <div className="relative">
                                            <Input name="price" type="number" value={form.price} onChange={onChange} min={0} step={1} placeholder="0" className="pr-9" />
                                            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500">원</span>
                                        </div>
                                    </label>
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-gray-700">카테고리</span>
                                        <NativeSelect name="category_id" value={form.category_id} onChange={onChange} className="w-full">
                                            <NativeSelectOption value="">카테고리 선택</NativeSelectOption>
                                            {categories.map((category) => (
                                                <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                    </label>
                                </div>
                                {state.errors?.price && <p className="text-red-600">{state.errors.price}</p>}
                                {state.errors?.category_id && <p className="text-red-600">{state.errors.category_id}</p>}
                                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Checkbox name="isNew" checked={form.isNew} onCheckedChange={(checked) => setForm((previous) => ({ ...previous, isNew: checked === true }))} className="mt-0.5" />
                                    <span className="space-y-1">
                                        <span className="block text-sm font-medium text-gray-900">신상품으로 표시</span>
                                        <span className="block text-xs text-gray-500">신상품 표시 여부를 설정합니다.</span>
                                    </span>
                                </label>
                            </div>
                        </section>
                        <section className="space-y-3" aria-label="상품 설명">
                            <label className="block space-y-2">
                                <span className="text-sm font-semibold text-gray-900">상품 설명</span>
                                <textarea name="description" value={form.description} onChange={onChange} rows={5} placeholder="소재, 핏, 특징 등 상품 설명을 입력하세요." className="block w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-gray-400 focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200" />
                            </label>
                        </section>
                        <section className="space-y-3" aria-label="상품 이미지">
                            <h3 className="text-sm font-semibold text-gray-900">상품 이미지</h3>
                            {/* 기존 이미지 업로드 TODO는 그대로 유지 */}
                        </section>
                        {isEdit && product && <ProductVariantsEditor key={product.id} productId={product.id} />}
                        {!isEdit && <p className="text-xs text-gray-500">신규 상품은 먼저 저장한 뒤 수정 화면에서 옵션을 등록해.</p>}
                        {state.errors?.form && <p className="text-red-600">{state.errors.form}</p>}
                    </div>
                    <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
                        <Button type="submit" disabled={isPending}>저장</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
