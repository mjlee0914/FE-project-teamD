// 토스 결제 수단 위젯
'use client';

import { useEffect, useRef, useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import {
    loadTossPayments,
    type TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';

interface TossPaymentWidgetProps {
    amount: number;
    customerKey: string; // 토스가 구매자를 구분하는 값 (로그인한 사용자 id)
    onReady: (widgets: TossPaymentsWidgets) => void;
}

export default function TossPaymentWidget({
    amount,
    customerKey,
    onReady,
}: TossPaymentWidgetProps) {
    const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
    // 개발 모드에서 effect가 두 번 실행돼도 위젯은 한 번만 그리게 막는다
    const startedRef = useRef(false);
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    const [loadError, setLoadError] = useState<string | null>(null);
    const error = clientKey
        ? loadError
        : '결제 설정(NEXT_PUBLIC_TOSS_CLIENT_KEY)이 없습니다.';

    // 처음 한 번: 토스 SDK 불러와서 결제수단·약관 UI 그리기
    useEffect(() => {
        if (!clientKey || startedRef.current) return;
        startedRef.current = true;

        (async () => {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const widgets = tossPayments.widgets({ customerKey });
                await widgets.setAmount({ currency: 'KRW', value: amount });
                await Promise.all([
                    widgets.renderPaymentMethods({
                        selector: '#toss-payment-method',
                    }),
                    widgets.renderAgreement({ selector: '#toss-agreement' }),
                ]);
                widgetsRef.current = widgets;
                onReady(widgets);
            } catch (e) {
                console.error('Toss widget error:', e);
                setLoadError('결제 수단을 불러오지 못했습니다.');
            }
        })();
        // 위젯은 한 번만 그린다. 금액 변경은 아래 effect에서 처리
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientKey, customerKey]);

    // 금액이 바뀌면 위젯 금액도 바꾸기
    useEffect(() => {
        widgetsRef.current?.setAmount({ currency: 'KRW', value: amount });
    }, [amount]);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FiCreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-bold text-gray-900">결제 수단</h2>
            </div>

            {error ? (
                <p className="py-10 text-center text-sm text-red-600">
                    {error}
                </p>
            ) : (
                <>
                    <div id="toss-payment-method" />
                    <div id="toss-agreement" />
                </>
            )}
        </div>
    );
}
