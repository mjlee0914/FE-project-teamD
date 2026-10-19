import AdminHeader from '@/shared/components/admin/Header';
import AdminLeftMenu from '@/shared/components/admin/LeftMenu';
import '../globals.css';

export default function ShopAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-dvh flex-col">
            <AdminHeader />
            <main className="flex flex-1">
                <aside className="w-60 shrink-0">
                    <AdminLeftMenu />
                </aside>

                <div className="min-w-0 flex-1 p-6">{children}</div>
            </main>
        </div>
    );
}
