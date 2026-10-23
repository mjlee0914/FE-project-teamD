'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';
import { confirmTossPayment } from '@/domains/orders/services/toss.service';

export type ConfirmPaymentResult =
    | { success: true; orderId: string }
    | { success: false; code: string; message: string };

// 토스 결제창에서 돌아온 뒤(successUrl) 결제를 최종 승인하고 주문을 완료 처리한다.
export async function confirmPayment(params: {
    paymentKey: string;
    orderId: string;
    amount: number;
}): Promise<ConfirmPaymentResult> {
    const { paymentKey, orderId, amount } = params;
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            code: 'UNAUTHORIZED',
            message: '로그인이 필요합니다.',
        };
    }

    // ① 내 주문인지, 결제 대기 중인지 확인
    const { data: order } = await supabase
        .from('orders')
        .select('id, status, final_price')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (!order) {
        return {
            success: false,
            code: 'ORDER_NOT_FOUND',
            message: '주문을 찾을 수 없습니다.',
        };
    }

    // 새로고침 등으로 두 번 들어와도 이미 끝난 주문이면 그대로 성공 처리
    if (order.status === '결제완료') {
        return { success: true, orderId };
    }

    if (order.status !== '결제대기') {
        return {
            success: false,
            code: 'INVALID_ORDER_STATUS',
            message: '결제할 수 없는 주문 상태입니다.',
        };
    }

    // ② 금액 위조 확인: 결제창에서 넘어온 금액 = 서버에 저장된 주문 금액
    if (order.final_price !== amount) {
        return {
            success: false,
            code: 'AMOUNT_MISMATCH',
            message: '결제 금액이 주문 금액과 다릅니다.',
        };
    }

    // ③ 토스에 결제 승인 요청
    const result = await confirmTossPayment(paymentKey, orderId, amount);
    if (!result.ok) {
        return { success: false, code: result.code, message: result.message };
    }

    const payment = result.payment;
    const now = new Date().toISOString();

    // ④ 결제 기록 저장
    const { error: paymentError } = await supabase.from('payments').insert({
        id: crypto.randomUUID(),
        order_id: orderId,
        payment_method: payment.method,
        payment_key: payment.paymentKey,
        approved_at: payment.approvedAt,
        raw_data: payment,
        amount: payment.totalAmount,
        status: payment.status,
    });
    if (paymentError) {
        console.error('Error saving payment:', paymentError);
    }

    // ⑤ 주문 상태 변경 + 상태 변경 기록
    await supabase
        .from('orders')
        .update({
            status: '결제완료',
            payment_method: payment.method,
            updated_at: now,
        })
        .eq('id', orderId);

    await supabase.from('order_logs').insert({
        id: crypto.randomUUID(),
        order_id: orderId,
        user_id: user.id,
        prev_status: '결제대기',
        status: '결제완료',
        created_at: now,
    });

    // ⑥ 주문한 상품은 장바구니에서 ORDERED로 (줄은 지우지 않고 기록으로 남김)
    const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, option')
        .eq('order_id', orderId);

    for (const item of orderItems ?? []) {
        let query = supabase
            .from('cart_items')
            .update({ status: 'ORDERED', updated_at: now })
            .eq('user_id', user.id)
            .eq('product_id', item.product_id)
            .eq('status', 'ACTIVE');
        query =
            item.option === null
                ? query.is('option', null)
                : query.eq('option', item.option);
        await query;
    }

    // 헤더 장바구니 숫자 등 새로고침
    revalidatePath('/', 'layout');

    return { success: true, orderId };
}
