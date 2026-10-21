'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

export async function updateCartQuantity(
    cartItemId: string,
    quantity: number,
): Promise<{ success: boolean; message: string }> {
    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: '로그인이 필요한 기능입니다.' };
    }

    if (quantity < 1 || quantity > 99) {
        return { success: false, message: '수량은 1~99까지 선택가능합니다.' };
    }

    const { error } = await supabase
        .from('cart_items')
        .update({
            quantity,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .eq('id', cartItemId);

    if (error) {
        console.error('Error updating from cart:', error);
        return {
            success: false,
            message: '수량을 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.',
        };
    }
    revalidatePath('/', 'layout');
    return { success: true, message: '수량이 변경되었습니다.' };
}
