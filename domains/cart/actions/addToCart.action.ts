'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

export async function addToCart(
    productId: string,
    quantity: number,
    option: string | null,
): Promise<{ success: boolean; message: string }> {
    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 기능입니다.' };
    }

    if (quantity <= 0) {
        return { success: false, message: '수량을 확인해주세요.' };
    }

    let query = supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('status', 'ACTIVE');

    //옵션이 없으면 비어 있는 것끼리, 있으면 같은 글자끼리 비교
    query =
        option === null ? query.is('option', null) : query.eq('option', option);

    const { data: existing } = await query.maybeSingle();
    //장바구니에 상품이 있으면 수량업데이트
    if (existing) {
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({
                quantity: existing.quantity + quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

        if (updateError) {
            console.error('Error updating cart:', updateError);
            return {
                success: false,
                message: '장바구니에 추가하지 못했습니다.',
            };
        }
        revalidatePath('/', 'layout');
        return { success: true, message: '장바구니에 추가되었습니다.' };
    }

    // 장바구니 없으면 새로 추가
    const { error } = await supabase.from('cart_items').insert([
        {
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
            option: option,
            status: 'ACTIVE', //장바구니 상태
        },
    ]);
    if (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: '장바구니에 추가하지 못했습니다.' };
    }
    // 헤더 장바구니 갱신
    revalidatePath('/', 'layout');
    return { success: true, message: '장바구니에 추가되었습니다.' };
}
