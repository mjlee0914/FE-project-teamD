// 초기 코드입니다
// 최신 주문 조회 함수
// 서버 supabase 사용하는 일반 조회 함수
// use server 없이 서버 코드에서만 호출

import { createServerClient } from '@/lib/supabase';

// 배송지 조회 결과의 모양을 TypeScript에 알려주는 타입
// type을 붙였기 때문에 실제 실행 코드에는 포함되지 않음 (타입검사에만 필요하며 실행될 때 사라짐), 브라우저나 서버가 사용하지 않음
import type { OrderShippingInfo } from '../types/order.types';

type ShippingInfoResult = OrderShippingInfo | null;

export async function getLatestPaidOrderShippingInfo(
    userId: string,
): Promise<ShippingInfoResult> {
    const supabase = await createServerClient();

    // orders와 payments 사이에 FK가 없으므로 관계형 조회(payments!inner)를
    // 사용할 수 없다. 먼저 로그인 사용자의 결제 완료 주문을 조회한다.
    const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select(
            `
            id,
            recipient,
            recipient_phone,
            zipcode,
            address,
            address_detail,
            delivery_memo
        `,
        )
        .eq('user_id', userId)
        .eq('status', '결제완료')
        .not('created_at', 'is', null)
        .order('created_at', { ascending: false });

    if (orderError) {
        throw orderError;
    }

    if (!orders || orders.length === 0) {
        return null;
    }

    // 위 주문 중 payments.status가 DONE인 주문 ID만 확인한다.
    const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('order_id')
        .in(
            'order_id',
            orders.map((order) => order.id),
        )
        .eq('status', 'DONE');

    if (paymentError) {
        throw paymentError;
    }

    const paidOrderIds = new Set(
        (payments ?? []).map((payment) => payment.order_id),
    );

    const latestPaidOrder = orders.find((order) => paidOrderIds.has(order.id));

    if (!latestPaidOrder) {
        return null;
    }

    return {
        recipient: latestPaidOrder.recipient,
        recipient_phone: latestPaidOrder.recipient_phone,
        zipcode: latestPaidOrder.zipcode,
        address: latestPaidOrder.address,
        address_detail: latestPaidOrder.address_detail,
        delivery_memo: latestPaidOrder.delivery_memo,
    };
}
