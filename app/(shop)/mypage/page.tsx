import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import ProfileForm from '@/domains/auth/components/ProfileForm';

type SearchParams = Promise<{ saved?: string }>;

async function MyPageContent({ searchParams }: { searchParams: SearchParams }) {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    // 저장 후 /mypage?saved=1 로 돌아오면 완료 안내를 보여준다
    const { saved } = await searchParams;

    return (
        <ProfileForm
            email={profile.email ?? ''}
            name={profile.username ?? ''}
            phone={profile.phone ?? ''}
            address={profile.address ?? ''}
            saved={saved === '1'}
        />
    );
}

// 체크아웃(주문/결제) 페이지와 같은 레이아웃: 굵은 제목 + 카드
export default function MyPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
            <h3 className="text-2xl font-black text-gray-900">마이페이지</h3>
            <p className="mt-1 mb-6 text-sm text-gray-500">
                회원 정보를 확인하고 수정할 수 있어요.
            </p>
            <Suspense
                fallback={
                    <p className="py-20 text-center text-sm text-gray-500">
                        회원 정보를 불러오는 중...
                    </p>
                }
            >
                <MyPageContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
