import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import ProfileForm from '@/domains/auth/components/ProfileForm';

async function MyPageContent() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return (
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 pb-16 md:gap-8 md:p-6 lg:gap-10 lg:p-8">
            {/* 페이지 제목 */}
            <h2 className="text-center text-xl font-semibold md:text-2xl lg:text-3xl">
                정보수정 페이지
            </h2>

            {/* 메인 콘텐츠 */}
            <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                {/* 사이드바 */}
                <aside className="hidden border-r pr-4 lg:block">
                    <nav className="space-y-1.5">
                        {/* 클릭 시 이동할 링크 */}
                    </nav>
                </aside>

                {/* 컨텐츠 영역 */}
                <section className="w-full">
                    <ProfileForm
                        email={profile.email ?? ''}
                        name={profile.username ?? ''}
                        phone={profile.phone ?? ''}
                        address={profile.address ?? ''}
                    />
                </section>
            </div>
        </div>
    );
}

export default function MyPage() {
    return (
        <div className="flex min-h-[calc(100vh-56px)] flex-col">
            <Suspense
                fallback={<p className="text-center text-lg">로딩중...</p>}
            >
                <MyPageContent />
            </Suspense>
        </div>
    );
}
