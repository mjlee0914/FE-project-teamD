'use server';

import { createServerClient } from '@/lib/supabase';
import { calculateOrderAmount } from '@/domains/orders/utils/orderAmount';

export interface CreateOrderInput {
    shipping: {
        recipient: string;
        phone: string;
        zipcode: string;
        address: string;
        addressDetail: string;
        deliveryMemo: string;
    };
    items: { productId: string; quantity: number; option: string | null }[];
}

export type CreateOrderResult =
    | {
          success: true;
          orderId: string;
          amount: number;
          orderName: string;
          customerName: string;
          customerEmail: string;
      }
    | { success: false; message: string };

function fail(message: string): CreateOrderResult {
    return { success: false, message };
}

// 결제 전에 "결제대기" 주문을 먼저 만든다.
// 금액은 화면에서 받은 값을 믿지 않고, DB 상품 가격으로 서버에서 다시 계산한다 (금액 위조 방지).
export async function createOrder(
    input: CreateOrderInput,
): Promise<CreateOrderResult> {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return fail('로그인이 필요합니다.');
    }

    // ① 배송지 검사
    const s = input.shipping;
    const phone = s.phone.replace(/\D/g, '');
    if (s.recipient.trim().length < 2) {
        return fail('받는분 이름을 2글자 이상 입력해 주세요.');
    }
    if (!/^010\d{8}$/.test(phone)) {
        return fail('연락처를 010으로 시작하는 11자리로 입력해 주세요.');
    }
    if (!/^\d{5}$/.test(s.zipcode)) {
        return fail('우편번호 찾기로 주소를 선택해 주세요.');
    }
    if (s.address.trim() === '' || s.addressDetail.trim().length < 2) {
        return fail('주소와 상세 주소를 입력해 주세요.');
    }

    // ② 주문 상품 검사
    if (input.items.length === 0) {
        return fail('주문할 상품이 없습니다.');
    }
    if (input.items.some((item) => item.quantity < 1 || item.quantity > 99)) {
        return fail('수량은 1~99개까지 주문할 수 있습니다.');
    }

    // ③ DB에서 상품 이름·가격 가져와서 금액 다시 계산
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .in('id', productIds);

    if (productError || !products || products.length !== productIds.length) {
        return fail('판매가 종료되었거나 찾을 수 없는 상품이 있습니다.');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const orderItems = input.items.map((item) => {
        const product = productMap.get(item.productId)!;
        return {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            quantity: item.quantity,
            option: item.option,
        };
    });

    const amount = calculateOrderAmount(
        orderItems.reduce(
            (sum, item) => sum + item.product_price * item.quantity,
            0,
        ),
    );

    // ④ 주문자 정보 (프로필)
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, phone')
        .eq('id', user.id)
        .maybeSingle();

    // ⑤ 주문 저장 (orders, order_items 테이블에 id 기본값이 없어서 여기서 만든다)
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        user_id: user.id,
        status: '결제대기',
        order_name: profile?.username ?? null,
        order_email: user.email ?? null,
        order_phone: profile?.phone ?? null,
        recipient: s.recipient.trim(),
        recipient_phone: phone,
        zipcode: s.zipcode,
        address: s.address.trim(),
        address_detail: s.addressDetail.trim(),
        delivery_memo: s.deliveryMemo.trim() || null,
        total_price: amount.totalPrice,
        discount_price: amount.discountPrice,
        shipping_fee: amount.shippingFee,
        final_price: amount.finalPrice,
        created_at: now,
        updated_at: now,
    });

    if (orderError) {
        console.error('Error creating order:', orderError);
        return fail('주문을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
        orderItems.map((item) => ({
            id: crypto.randomUUID(),
            order_id: orderId,
            ...item,
        })),
    );

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        await supabase.from('orders').delete().eq('id', orderId);
        return fail('주문을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }

    // 토스 결제창에 보여줄 주문 이름 (예: "아노락 재킷 외 2건")
    const first = orderItems[0].product_name;
    const orderName =
        orderItems.length > 1
            ? `${first} 외 ${orderItems.length - 1}건`
            : first;

    return {
        success: true,
        orderId,
        amount: amount.finalPrice,
        orderName,
        customerName: profile?.username ?? s.recipient.trim(),
        customerEmail: user.email ?? '',
    };
}
