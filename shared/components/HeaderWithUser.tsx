import Header from '@/shared/components/Header';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import { getCartCount } from '@/domains/cart/queries/getCartCount.query';

// 로그인한 사람 이름과 장바구니 개수를 서버에서 가져와 헤더에 넘겨준다.
// 레이아웃에서는 <Suspense>로 감싸서 쓴다.
export default async function HeaderWithUser() {
    const profile = await getProfile();
    const cartCount = await getCartCount();

    return (
        <Header userName={profile?.username ?? null} cartCount={cartCount} />
    );
}
