// 데이터와 결제 흐름을 관리하는 부모
// 장바구니를 한 번만 가져와 각 컴포넌트에 필요한 데이터를 전달힘.

'use client';
import ShippingInfo from '@/domains/orders/components/ShippingInfo';
import CheckoutOrderItems from '@/domains/orders/components/CheckoutOrderItems';
import CheckoutPaymentSummary from '@/domains/orders/components/CheckoutPaymentSummary';
import TossPaymentWidget from '@/domains/orders/components/TossPaymentWidget';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';

export default function CheckoutForm() {
    // 임시 데이터 - 장바구니 API 연결 후 조회 결과로 교체 예정
    const cartItems = MOCK_CART_ITEMS;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <ShippingInfo />
                <TossPaymentWidget />
            </div>

            <div className="space-y-6">
                <CheckoutOrderItems items={cartItems} />
                <CheckoutPaymentSummary />
            </div>
        </div>
    );
}
