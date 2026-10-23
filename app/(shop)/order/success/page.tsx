import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentSuccessHandler from '@/domains/orders/components/PaymentSuccessHandler';

// 토스 결제 성공 후 돌아오는 주소
// /order/success?paymentType=NORMAL&orderId=...&paymentKey=...&amount=...
type SearchParams = Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
}>;

async function SuccessContent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { paymentKey, orderId, amount } = await searchParams;

    if (!paymentKey || !orderId || !amount) {
        redirect(
            '/order/fail?code=INVALID_REQUEST&message=결제 정보가 올바르지 않습니다.',
        );
    }

    return (
        <PaymentSuccessHandler
            paymentKey={paymentKey}
            orderId={orderId}
            amount={Number(amount)}
        />
    );
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense
            fallback={
                <p className="py-24 text-center text-sm text-gray-500">
                    결제를 확인하고 있어요...
                </p>
            }
        >
            <SuccessContent searchParams={searchParams} />
        </Suspense>
    );
}
