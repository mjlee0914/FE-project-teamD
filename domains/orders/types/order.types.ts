export interface Order {
    id: string; // PK / UUID
    user_id: string; // FK / UUID
    status: string | null; // VARCHAR(20)
    order_name: string | null; // VARCHAR(100)
    order_email: string | null; // VARCHAR(255)
    order_phone: string | null; // VARCHAR(20)
    recipient: string | null; // VARCHAR(100)
    recipient_phone: string | null; // VARCHAR(20)
    zipcode: string | null; // VARCHAR(20)
    address: string | null; // VARCHAR(255)
    address_detail: string | null; // VARCHAR(255)
    delivery_memo: string | null; // VARCHAR(255)
    total_price: number | null; // INT
    discount_price: number | null; // INT
    final_price: number | null; // INT
    payment_method: string | null; // VARCHAR(50)
    created_at: Date | null; // TIMESTAMPTZ
    updated_at: Date | null; // TIMESTAMPTZ
    shipping_fee: number | null; // INT
}

export interface OrderItem {
    id: string; // PK / UUID
    order_id: string; // FK / UUID
    product_id: string; // FK / UUID
    product_name: string | null; // VARCHAR(255)
    product_price: number | null; // INT
    quantity: number | null; // INT
    option: string | null; // VARCHAR(100)
}

export interface OrderLog {
    id: string; // PK / UUID
    order_id: string; // FK / UUID
    user_id: string; // FK / UUID
    prev_status: string | null; // VARCHAR(20)
    status: string | null; // VARCHAR(20)
    created_at: Date | null; // TIMESTAMPTZ
}

// 최근 배송지 조회 기능에서 사용
export interface OrderShippingInfo {
    recipient: string | null;
    recipient_phone: string | null;
    zipcode: string | null;
    address: string | null;
    address_detail: string | null;
    delivery_memo: string | null;
}

export type ShippingInfoActionResult =
    | {
          success: true;
          data: OrderShippingInfo | null;
          message?: string;
      }
    | {
          success: false;
          data?: never;
          message: string;
      };
