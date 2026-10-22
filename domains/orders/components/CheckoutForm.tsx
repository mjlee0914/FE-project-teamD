// 데이터와 결제 흐름을 관리하는 부모
// 장바구니에서 넘어온 상품(useCheckoutStore)으로 금액을 계산하고, 결제하기를 누르면
// ① 서버에 결제대기 주문 만들기 → ② 토스 결제창 띄우기 순서로 진행한다.

'use client';
import { useRef, useState, useTransition } from 'react';
import type { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import ShippingInfo from '@/domains/orders/components/ShippingInfo';
import CheckoutOrderItems from '@/domains/orders/components/CheckoutOrderItems';
import CheckoutPaymentSummary from '@/domains/orders/components/CheckoutPaymentSummary';
import TossPaymentWidget from '@/domains/orders/components/TossPaymentWidget';
import useCheckoutStore from '@/domains/orders/store/useCheckoutStore';
import { calculateOrderAmount } from '@/domains/orders/utils/orderAmount';
import { createOrder } from '@/domains/orders/actions/createOrder.action';

export default function CheckoutForm({ customerKey }: { customerKey: string }) {
    const checkoutItems = useCheckoutStore((state) => state.checkoutItems);
    const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
    const [widgetReady, setWidgetReady] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isPending, startTransition] = useTransition();

    const amount = calculateOrderAmount(
        checkoutItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        ),
    );

    const handlePay = () => {
        if (checkoutItems.length === 0) {
            alert('주문할 상품이 없습니다.');
            return;
        }
        if (!agreed) {
            alert('구매조건 확인 및 결제 진행에 동의해 주세요.');
            return;
        }
        const widgets = widgetsRef.current;
        if (!widgets) {
            alert('결제 수단을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
            return;
        }

        // 배송지 입력값은 ShippingInfo 안의 form에서 읽는다
        const form = document.getElementById(
            'shipping-form',
        ) as HTMLFormElement | null;
        const data = new FormData(form ?? undefined);
        const read = (name: string) => String(data.get(name) ?? '');

        startTransition(async () => {
            const result = await createOrder({
                shipping: {
                    recipient: read('recipient'),
                    phone: read('phone'),
                    zipcode: read('zipcode'),
                    address: read('address'),
                    addressDetail: read('addressDetail'),
                    deliveryMemo: read('deliveryMemo'),
                },
                items: checkoutItems.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    option: item.option,
                })),
            });

            if (!result.success) {
                alert(result.message);
                return;
            }

            try {
                // 서버가 계산한 금액으로 맞춘 뒤 결제창 띄우기 (성공/실패 시 해당 주소로 이동)
                await widgets.setAmount({
                    currency: 'KRW',
                    value: result.amount,
                });
                await widgets.requestPayment({
                    orderId: result.orderId,
                    orderName: result.orderName,
                    customerName: result.customerName,
                    customerEmail: result.customerEmail || undefined,
                    successUrl: `${window.location.origin}/order/success`,
                    failUrl: `${window.location.origin}/order/fail`,
                });
            } catch (error) {
                // 약관 미동의, 결제수단 미선택 등 결제창을 띄우기 전 오류
                const message =
                    error instanceof Error
                        ? error.message
                        : '결제를 시작하지 못했습니다.';
                alert(message);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <ShippingInfo />
                <TossPaymentWidget
                    amount={amount.finalPrice}
                    customerKey={customerKey}
                    onReady={(widgets) => {
                        widgetsRef.current = widgets;
                        setWidgetReady(true);
                    }}
                />
            </div>

            <div className="space-y-6">
                <CheckoutOrderItems />
                <CheckoutPaymentSummary
                    amount={amount}
                    agreed={agreed}
                    onAgreeChange={setAgreed}
                    onPay={handlePay}
                    isPending={isPending}
                    disabled={!widgetReady || checkoutItems.length === 0}
                />
            </div>
        </div>
    );
}
