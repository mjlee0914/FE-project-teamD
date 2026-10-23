// main landing page
import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';
import { getPosts } from '@/domains/boards/lib/boardRepository';
import { CATEGORY_NAMES } from '@/domains/boards/lib/categoryNames';
import { Suspense } from 'react';
import { connection } from 'next/server';

async function EventSection() {
    // Supabase의 인증·시간 처리가 프리렌더링 중 실행되지 않도록 합니다.
    await connection();

    const { items } = await getPosts({
        boardId: 'events',
        pageSize: 20,
        excludeCategoryName: CATEGORY_NAMES.eventEnded, // 종료 이벤트 제외
    });
    return <EventBanner posts={items} />;
}

export default function HomePage() {
    return (
        <>
            <MainBanner />
            <PopularProducts />
            <Suspense fallback={null}>
                <EventSection />
            </Suspense>
        </>
    );
}
