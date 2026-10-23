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

    return (
        <>
            {/* 오른쪽 추천 사이드바가 장바구니를 가리지 않게 자리를 비워 둔다 */}
            <div className={recommends.length > 0 ? 'lg:pr-44' : ''}>
                <CartItemList key={listKey} initialItems={items} />
            </div>
            <RecommendSidebar products={recommends} />
        </>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<p className="text-center">불러오는 중...</p>}>
            <CartContent />
        </Suspense>
    );
}
