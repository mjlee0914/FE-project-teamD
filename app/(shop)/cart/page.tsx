import { Suspense } from 'react';
import CartItemList from '@/domains/cart/components/CartItemList';
import { getCartItems } from '@/domains/cart/queries/getCartItems.query';
import RecommendSidebar from '@/domains/cart/components/RecommendSidebar';
import { getRecommends } from '@/domains/cart/queries/getRecommends.query';

async function CartContent() {
    const items = await getCartItems();
    const recommends = await getRecommends(items);

    // CartItemList는 useState(initialItems)라서 처음 받은 목록을 계속 들고 있다.
    // 서버 목록이 바뀌면(로그인·로그아웃 등) key를 바꿔서 새 목록으로 다시 시작하게 한다.
    const listKey = items
        .map((item) => `${item.id}:${item.quantity}`)
        .join(',');

    // 장바구니(왼쪽)와 추천 상품(오른쪽)을 한 줄에 나란히 둔다
    return (
        <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 md:px-6">
            <div className="min-w-0 flex-1">
                <CartItemList key={listKey} initialItems={items} />
            </div>
            <RecommendSidebar products={recommends} />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <p className="py-20 text-center text-sm text-gray-500">
                    장바구니를 불러오는 중...
                </p>
            }
        >
            <CartContent />
        </Suspense>
    );
}
