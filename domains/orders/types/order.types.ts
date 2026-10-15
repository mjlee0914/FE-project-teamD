export interface Order {
    id: string;
    user_id: string;
    status: string;

    // 주문자
    order_name: string;
    order_email: string;
    order_phone: string;

    // 수령인 및 배송지
    recipient: string;
    recipient_phone: string;
    zipcode: string;
    address: string;
    address_detail: string;
    delivery_memo: string;

    // 금액: 원 단위 정수
    payment_method: string;
    total_price: number;
    discount_price: number;
    shipping_fee: number;
    final_price: number;

    created_at: string;
    updated_at: string;
}
