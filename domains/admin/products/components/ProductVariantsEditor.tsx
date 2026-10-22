'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Variant = {
    id: string;
    color_name: string;
    color_hex: string;
    size: string;
    stock: number;
};

export default function ProductVariantsEditor({ productId }: { productId: string }) {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [colorName, setColorName] = useState('');
    const [colorHex, setColorHex] = useState('#F5F0E6');
    const [size, setSize] = useState('');
    const [stock, setStock] = useState(0);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const loadVariants = useCallback(async () => {
        const { data, error } = await supabase
            .from('product_variants')
            .select('id,color_name,color_hex,size,stock')
            .eq('product_id', productId)
            .order('color_name')
            .order('size');
        if (error) {
            setMessage(`조회 실패: ${error.message}`);
            return;
        }
        setVariants(data ?? []);
    }, [productId]);

    useEffect(() => {
        void loadVariants();
    }, [loadVariants]);

    async function saveVariant() {
        const name = colorName.trim();
        const chosenSize = size.trim().toUpperCase();
        if (!name || !chosenSize) {
            setMessage('색상명과 사이즈를 모두 입력해 줘.');
            return;
        }
        if (!Number.isInteger(stock) || stock < 0) {
            setMessage('재고는 0 이상의 정수로 입력해 줘.');
            return;
        }

        setSaving(true);
        setMessage('');
        try {
            const { data, error } = await supabase
                .from('product_variants')
                .upsert(
                    {
                        product_id: productId,
                        color_name: name,
                        color_hex: colorHex,
                        size: chosenSize,
                        stock,
                    },
                    { onConflict: 'product_id,color_name,size' },
                )
                .select('id');
            if (error || !data?.length) {
                setMessage(`저장 실패: ${error?.message ?? '저장 권한을 확인해 줘.'}`);
                return;
            }
            setMessage('옵션 저장 완료!');
            await loadVariants();
        } finally {
            setSaving(false);
        }
    }

    async function deleteVariant(id: string) {
        if (!window.confirm('이 색상/사이즈 옵션을 삭제할까?')) return;
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('product_variants')
                .delete()
                .eq('id', id)
                .eq('product_id', productId)
                .select('id');
            if (error || !data?.length) {
                setMessage(`삭제 실패: ${error?.message ?? '권한을 확인해 줘.'}`);
                return;
            }
            setMessage('옵션 삭제 완료');
            await loadVariants();
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="space-y-4 rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold">색상 · 사이즈 · 재고</h3>
            <p className="text-xs text-gray-500">
                색상/사이즈 조합별로 등록해. 이미 있는 조합은 재고가 수정돼.
            </p>
            <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm">
                    <span>색상명</span>
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="아이보리"
                        maxLength={50}
                        value={colorName}
                        onChange={(event) => setColorName(event.target.value)}
                    />
                </label>
                <label className="space-y-1 text-sm">
                    <span>색상 표시</span>
                    <input
                        type="color"
                        className="block h-10 w-full cursor-pointer"
                        value={colorHex}
                        onChange={(event) => setColorHex(event.target.value)}
                    />
                </label>
                <label className="space-y-1 text-sm">
                    <span>사이즈</span>
                    <input
                        className="w-full rounded border px-3 py-2"
                        placeholder="S / M / L / 260"
                        maxLength={20}
                        value={size}
                        onChange={(event) => setSize(event.target.value)}
                    />
                </label>
                <label className="space-y-1 text-sm">
                    <span>재고</span>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        className="w-full rounded border px-3 py-2"
                        value={stock}
                        onChange={(event) => setStock(Number(event.target.value))}
                    />
                </label>
            </div>
            <button
                type="button"
                disabled={saving}
                onClick={() => void saveVariant()}
                className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
                {saving ? '처리 중...' : '옵션 저장'}
            </button>
            {message && <p role="status" className="text-sm">{message}</p>}
            <div className="space-y-2">
                {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between gap-2 border-t pt-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 shrink-0 rounded-full border" style={{ backgroundColor: variant.color_hex }} />
                            <span>{variant.color_name} / {variant.size} · 재고 {variant.stock}개</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="underline"
                                onClick={() => {
                                    setColorName(variant.color_name);
                                    setColorHex(variant.color_hex);
                                    setSize(variant.size);
                                    setStock(variant.stock);
                                }}
                            >
                                선택
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                className="text-red-600 disabled:opacity-50"
                                onClick={() => void deleteVariant(variant.id)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
                {variants.length === 0 && <p className="text-xs text-gray-500">등록된 옵션이 없어.</p>}
            </div>
        </section>
    );
}
