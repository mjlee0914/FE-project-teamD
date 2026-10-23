import { createServerClient } from '@/lib/supabase';

// 사용자가 이 상품을 구매했는지 (결제 완료 주문에 이 상품이 들어 있는지)
// - orders ↔ payments는 FK가 있어서 payments!inner로 같이 조회
// - orders ↔ order_items는 FK가 없어서 주문 id를 먼저 구한 뒤 따로 조회
// - 결제 완료 기준은 payments.status = 'DONE' (주문 쪽 코드와 같은 기준)
// - userId는 화면이 넘긴 값이 아니라 서버에서 읽은 getCurrentUser().id를 사용할 것
export async function hasPurchasedProduct(
    userId: string,
    productId: string,
): Promise<boolean> {
    const supabase = await createServerClient();

    // 1) 이 사용자의 결제 완료(DONE) 주문 id
    const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('id, payments!inner(status)')
        .eq('user_id', userId)
        .eq('payments.status', 'DONE');
    if (orderError) {
        throw new Error(`구매 내역 조회 실패: ${orderError.message}`);
    }

    const orderIds = (orders ?? []).map((o) => o.id);
    if (orderIds.length === 0) return false;

    // 2) 그 주문들 중 이 상품이 들어 있는지
    const { data: items, error: itemError } = await supabase
        .from('order_items')
        .select('id')
        .in('order_id', orderIds)
        .eq('product_id', productId)
        .limit(1);
    if (itemError) {
        throw new Error(`구매 상품 조회 실패: ${itemError.message}`);
    }

    return (items ?? []).length > 0;
}
