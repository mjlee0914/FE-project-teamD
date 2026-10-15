'use client';

import type { ReactNode } from 'react';
import type { Order } from '@/domains/orders/types/order.types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { formatPrice } from '@/shared/utils/formatPrice';
import { formatDate } from '@/shared/utils/formatDate';

interface OrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order;
}

function InfoField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="min-w-0 space-y-1">
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="font-medium break-words whitespace-pre-wrap text-gray-900">
                {children}
            </dd>
        </div>
    );
}

export default function OrderInfoModal({
    open,
    onOpenChange,
    order,
}: OrderModalProps) {
    const paymentRows = [
        ['결제 방법', order.payment_method],
        ['상품 금액', formatPrice(order.total_price)],
        [
            '할인 금액',
            (order.discount_price > 0 ? '−' : '') +
                formatPrice(order.discount_price),
        ],
        ['배송비', formatPrice(order.shipping_fee)],
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-12">
                    <div className="flex flex-wrap items-center gap-3">
                        <DialogTitle className="text-xl">
                            주문 상세 정보
                        </DialogTitle>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {order.status}
                        </span>
                    </div>
                    <DialogDescription className="text-xs break-all">
                        주문 번호 · {order.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                    <section className="space-y-3" aria-label="주문자 정보">
                        <h3 className="font-semibold text-gray-900">
                            주문자 정보
                        </h3>
                        <dl className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
                            <InfoField label="주문자명">
                                {order.order_name}
                            </InfoField>
                            <InfoField label="연락처">
                                {order.order_phone}
                            </InfoField>
                            <InfoField label="이메일">
                                {order.order_email}
                            </InfoField>
                        </dl>
                    </section>

                    <section className="space-y-3" aria-label="배송 정보">
                        <h3 className="font-semibold text-gray-900">
                            배송 정보
                        </h3>
                        <dl className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
                            <InfoField label="수령인">
                                {order.recipient}
                            </InfoField>
                            <InfoField label="수령인 연락처">
                                {order.recipient_phone}
                            </InfoField>
                            <div className="sm:col-span-2">
                                <InfoField label="배송지">
                                    ({order.zipcode}) {order.address}
                                    <br />
                                    {order.address_detail}
                                </InfoField>
                            </div>
                            <div className="sm:col-span-2">
                                <InfoField label="배송 요청사항">
                                    {order.delivery_memo || '없음'}
                                </InfoField>
                            </div>
                        </dl>
                    </section>

                    <section className="space-y-3" aria-label="결제 정보">
                        <h3 className="font-semibold text-gray-900">
                            결제 정보
                        </h3>
                        <dl className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            {paymentRows.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between gap-4"
                                >
                                    <dt className="text-gray-500">{label}</dt>
                                    <dd className="text-right font-medium tabular-nums">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                                <dt className="font-semibold">
                                    최종 결제 금액
                                </dt>
                                <dd className="text-xl font-bold tabular-nums">
                                    {formatPrice(order.final_price)}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoField label="주문 일시">
                            {formatDate(order.created_at)}
                        </InfoField>
                        <InfoField label="최근 변경 일시">
                            {formatDate(order.updated_at)}
                        </InfoField>
                    </dl>
                </div>

                <div className="flex shrink-0 justify-end border-t border-gray-200 px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        닫기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
