// 초기 코드입니다

import { createServerClient } from '@/lib/supabase';
import type { OrderShippingInfo } from '../types/order.types';

type ShippingInfoResult = OrderShippingInfo | null;

export async function getLatestPaidOrderShippingInfo(
    userId: string,
): Promise<ShippingInfoResult> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
            recipient,
            recipient_phone,
            zipcode,
            address,
            address_detail,
            delivery_memo,
            payments!inner(status)
        `,
        )
        .eq('user_id', userId)
        .eq('payments.status', 'DONE')
        .not('created_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    return {
        recipient: data.recipient,
        recipient_phone: data.recipient_phone,
        zipcode: data.zipcode,
        address: data.address,
        address_detail: data.address_detail,
        delivery_memo: data.delivery_memo,
    };
}
