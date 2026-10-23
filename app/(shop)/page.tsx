// main landing page
import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';
import { getPosts } from '@/domains/boards/lib/boardRepository';
import { CATEGORY_NAMES } from '@/domains/boards/lib/categoryNames';
import { Suspense } from 'react';

async function EventSection() {
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
