import Header from '@/shared/components/Header';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import { getCartCount } from '@/domains/cart/queries/getCartCount.query';
import { getHeaderCategories } from '@/domains/categories/queries/getHeaderCategories.query';

// 로그인한 사람 이름, 장바구니 개수와 최상위 상품 카테고리를 서버에서 가져온다.
// 레이아웃에서는 <Suspense>로 감싸서 쓴다.
export default async function HeaderWithUser() {
    const [profile, cartCount, categories] = await Promise.all([
        getProfile(),
        getCartCount(),
        getHeaderCategories(),
    ]);

    return (
        <Header
            userName={profile?.username ?? null}
            cartCount={cartCount}
            categories={categories}
            isAdmin={profile?.role === 'ADMIN'}
        />
    );
}
