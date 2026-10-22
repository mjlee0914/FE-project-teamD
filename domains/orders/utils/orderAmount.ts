// 장바구니·체크아웃·주문 생성에서 같은 규칙으로 금액을 계산한다.
export const FREE_SHIPPING_MIN = 50000; // 5만 원 이상 무료배송
export const SHIPPING_FEE = 3000;

export interface OrderAmount {
    totalPrice: number; // 상품 금액 합계
    discountPrice: number; // 할인 (아직 없음)
    shippingFee: number; // 배송비
    finalPrice: number; // 최종 결제 금액
}

export function calculateOrderAmount(totalPrice: number): OrderAmount {
    const discountPrice = 0;
    const shippingFee =
        totalPrice === 0 || totalPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;

    return {
        totalPrice,
        discountPrice,
        shippingFee,
        finalPrice: totalPrice - discountPrice + shippingFee,
    };
}
