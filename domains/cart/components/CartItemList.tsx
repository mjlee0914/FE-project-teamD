import { formatPrice } from '@/shared/utils/formatPrice';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';

export default function CartItemList() {
    return (
        <ul>
            {MOCK_CART_ITEMS.map((item) => {
                return (
                    <li key={item.product.id}>
                        <p>상품명: {item.product.name}</p>
                        <p>가격: {formatPrice(item.product.price)}</p>
                        <p>수량: {item.quantity}</p>
                        <p>
                            합계금액:{' '}
                            {formatPrice(item.product.price * item.quantity)}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
}
