'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { confirmPayment } from '@/domains/orders/actions/confirmPayment.action';
import useCheckoutStore from '@/domains/orders/store/useCheckoutStore';

interface PaymentSuccessHandlerProps {
    paymentKey: string;
    orderId: string;
    amount: number;
}

// 토스 결제창에서 돌아오면(successUrl) 서버에 결제 승인을 요청하고,
// 결과에 따라 주문완료 / 주문실패 페이지로 보낸다.
export default function PaymentSuccessHandler({
    paymentKey,
    orderId,
    amount,
}: PaymentSuccessHandlerProps) {
    const router = useRouter();
    const clearCheckoutItems = useCheckoutStore(
        (state) => state.clearCheckoutItems,
    );
    // 개발 모드에서 effect가 두 번 실행돼도 승인 요청은 한 번만
    const requestedRef = useRef(false);

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;

        (async () => {
            const result = await confirmPayment({
                paymentKey,
                orderId,
                amount,
            });

            if (result.success) {
                clearCheckoutItems();
                router.replace(`/order/complete?orderId=${result.orderId}`);
                return;
            }

            const params = new URLSearchParams({
                code: result.code,
                message: result.message,
                orderId,
            });
            router.replace(`/order/fail?${params.toString()}`);
        })();
    }, [paymentKey, orderId, amount, router, clearCheckoutItems]);

    return (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="text-lg font-black text-gray-900">
                결제를 확인하고 있어요
            </p>
            <p className="text-sm text-gray-500">
                잠시만 기다려 주세요. 창을 닫지 마세요.
            </p>
        </div>
    );
}
