import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { Cactus_Classical_Serif } from 'next/font/google';
import { getProfile } from '@/domains/auth/queries/getProfile.query';
import '../globals.css';

// Noto Sans KR 폰트 인스턴스 생성
const notoSansKr = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '900'],
    display: 'swap',
});

const cactus = Cactus_Classical_Serif({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-cactus-classical-serif',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Team D Shopping Mall',
    description: 'Team Disco Ninja FrontEnd Project',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = await getProfile();

    return (
        <html lang="ko" className={`h-full ${cactus.variable}`}>
            <body
                className={`${notoSansKr.className} flex min-h-screen flex-col bg-white text-gray-900 antialiased`}
            >
                <Header userName={profile?.username ?? null} />
                <main className="w-full flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
