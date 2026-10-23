import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function getCartCount(): Promise<number> {
    await connection();

    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return 0;
    }

    const { count, error } = await supabase
        .from('cart_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE');

    if (error) {
        console.error('Error fetching cart items:', error);
        return 0;
    }
    return count ?? 0;
}
