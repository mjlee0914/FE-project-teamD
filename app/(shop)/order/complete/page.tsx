import { Suspense } from 'react';
import OrderComplete from '@/domains/orders/components/OrderComplete';
import { getOrderReceipt } from '@/domains/orders/queries/getOrderReceipt.query';

type SearchParams = Promise<{ orderId?: string }>;

// 결제 성공 후 /order/complete?orderId=... 로 오면 주문 내역까지 보여주고,
// orderId가 없거나 내 주문이 아니면 완료 안내만 보여준다.
async function OrderCompleteContent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { orderId } = await searchParams;
    const receipt = orderId ? await getOrderReceipt(orderId) : null;

    return <OrderComplete receipt={receipt} />;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
    return (
        <Suspense
            fallback={
                <p className="py-20 text-center text-sm text-gray-500">
                    주문 정보를 불러오는 중...
                </p>
            }
        >
            <OrderCompleteContent searchParams={searchParams} />
        </Suspense>
    );
}
