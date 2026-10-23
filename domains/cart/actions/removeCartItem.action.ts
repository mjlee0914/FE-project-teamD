'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

export async function removeCartItem(
    cartItemId: string | undefined,
): Promise<{ success: boolean; message: string }> {
    const supabase = await createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 기능입니다.' };
    }

    let query = supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE');

    if (cartItemId) {
        query = query.eq('id', cartItemId); // 1건 삭제
    }

    const { error } = await query;

    if (error) {
        console.error('Error removing from cart:', error);
        return {
            success: false,
            message: '삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.',
        };
    }
    revalidatePath('/', 'layout');
    return { success: true, message: '장바구니에서 삭제되었습니다.' };
}
