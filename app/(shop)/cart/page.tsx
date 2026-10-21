import { Suspense } from 'react';
import CartItemList from '@/domains/cart/components/CartItemList';
import { getCartItems } from '@/domains/cart/queries/getCartItems.query';

async function CartContent() {
    const items = await getCartItems();
    return <CartItemList initialItems={items} />;
}

export default function Page() {
    return (
        <Suspense fallback={<p className="text-center">불러오는 중...</p>}>
            <CartContent />
        </Suspense>
    );
}
