// main landing page
import { Suspense } from 'react';
import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';
import { getPosts } from '@/domains/boards/lib/boardRepository';
import { CATEGORY_NAMES } from '@/domains/boards/lib/categoryNames';
import { Suspense } from 'react';
import { connection } from 'next/server';

export default async function HomePage() {
    // Supabase의 인증·시간 처리가 프리렌더링 중 실행되지 않도록 합니다.
    await connection()
    // 이벤트 게시판 글 받음
    const { items } = await getPosts({
        boardId: 'events',
        pageSize: 20,
        excludeCategoryName: CATEGORY_NAMES.eventEnded, // 종료 이벤트 제외
    });

    return (
        <>
            <MainBanner />
            <Suspense
                fallback={<p className="p-20">인기상품을 불러오는 중...</p>}
            >
                <PopularProducts />
            </Suspense>
            <EventBanner posts={items} />
        </>
    );
}
