import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { Order, OrderItem } from '@/domains/orders/types/order.types';

export interface OrderReceipt {
    order: Order;
    items: OrderItem[];
}

// 주문 완료 화면에 보여줄 주문 1건과 주문 상품 목록을 가져온다.
// 로그인한 본인의 주문만 조회하고, 없거나 남의 주문이면 null.
export async function getOrderReceipt(
    orderId: string,
): Promise<OrderReceipt | null> {
    await connection();

    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (error || !order) {
        if (error) console.error('Error fetching order:', error);
        return null;
    }

    // orders ↔ order_items 사이에 FK가 없어서 같이 가져오기 대신 따로 조회한다
    const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

    return { order, items: items ?? [] };
}
