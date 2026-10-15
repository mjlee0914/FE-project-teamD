import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
<<<<<<< HEAD
import React from 'react';

export default function ShopLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* 쇼핑몰 전용 헤더 */}
            <Header />

            {/* 쇼핑몰 메인 컨텐츠 영역 */}
            <main className="w-full flex-1">{children}</main>

            {/* @modal 슬롯 병렬 렌더링 영역 */}
            {modal}

            {/* 쇼핑몰 전용 푸터 */}
            <Footer />
        </div>
=======
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { Cactus_Classical_Serif } from 'next/font/google';
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={`h-full ${cactus.variable}`}>
            <body
                className={`${notoSansKr.className} flex min-h-screen flex-col bg-white text-gray-900 antialiased`}
            >
                <Header />
                <main className="w-full flex-1">{children}</main>
                <Footer />
            </body>
        </html>
>>>>>>> origin/main
    );
}
