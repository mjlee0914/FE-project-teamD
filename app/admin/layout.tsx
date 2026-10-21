import AdminHeader from '@/shared/components/admin/Header';
import AdminLeftMenu from '@/shared/components/admin/LeftMenu';
import '../globals.css';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default function ShopAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>
                <Suspense
                    fallback={<p role="status">관리자 권한 확인 중...</p>}
                >
                    <AdminContent>{children}</AdminContent>
                </Suspense>
            </body>
        </html>
    );
}

async function AdminContent({ children }: { children: React.ReactNode }) {
    const profile = await getProfile();

    if (!profile) redirect('/login');

    if (profile.role !== 'ADMIN') redirect('/');

    return (
        <div className="flex min-h-dvh flex-col">
            <AdminHeader profile={profile} />
            <main className="flex flex-1">
                <aside className="w-60 shrink-0">
                    <AdminLeftMenu />
                </aside>

                <div className="min-w-0 flex-1 p-6">{children}</div>
            </main>
        </div>
    );
}
