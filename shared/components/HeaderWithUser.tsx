import Header from '@/shared/components/Header';
import { getProfile } from '@/domains/auth/queries/getProfile.query';

// 로그인한 사람 이름을 서버에서 가져와 헤더에 넘겨준다.
// 레이아웃에서는 <Suspense>로 감싸서 쓴다.
export default async function HeaderWithUser() {
    const profile = await getProfile();

    return <Header userName={profile?.username ?? null} />;
}
