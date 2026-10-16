import type { ReactNode } from 'react';
import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';

export default function ShopLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="w-full flex-1">{children}</main>
            <Footer />
        </div>
    );
}
