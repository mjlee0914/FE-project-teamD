'use server';

import { createServerClient } from '@/lib/supabase';

export async function getOrderList({
    searchName,
    searchStatus,
}: {
    searchName?: string;
    searchStatus?: string;
} = {}) {
    const supabase = await createServerClient();

    let query = supabase.from('orders').select('*');

    if (searchName) query = query.like('order_name', `%${searchName}%`);

    if (searchStatus) query = query.like('status', `%${searchStatus}%`);

    return await query.order('created_at', { ascending: false });
}

export async function getOrderListByLimit(limit: number) {
    const supabase = await createServerClient();
    return await supabase
        .from('orders')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });
}
