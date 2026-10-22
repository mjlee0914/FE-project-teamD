import { Suspense } from 'react';
import OrderFail from '@/domains/orders/components/OrderFail';

// 토스 결제 실패 시 돌아오는 주소
// /order/fail?code=...&message=...&orderId=...
type SearchParams = Promise<{
    code?: string;
    message?: string;
    orderId?: string;
}>;

async function FailContent({ searchParams }: { searchParams: SearchParams }) {
    const { code, message, orderId } = await searchParams;
    return <OrderFail code={code} message={message} orderId={orderId} />;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense
            fallback={
                <p className="py-20 text-center text-sm text-gray-500">
                    불러오는 중...
                </p>
            }
        >
            <FailContent searchParams={searchParams} />
        </Suspense>
    );
}
