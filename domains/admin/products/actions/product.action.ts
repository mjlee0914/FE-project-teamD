'use server';

import { createServerClient } from '@/lib/supabase';

export async function getProductList(searchName?: string) {
    const supabase = createServerClient();

    let query = supabase.from('products').select('*, category(name)');

    if (searchName) query = query.like('name', `%${searchName}%`);

    return await query;
}
