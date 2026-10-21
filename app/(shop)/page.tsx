// main landing page
import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';
import { getPosts } from '@/domains/boards/lib/boardRepository';

export default async function HomePage() {
    // 이벤트 게시판 글 받음
    const { items } = await getPosts({ boardId: 'events', pageSize: 20 });

    return (
        <>
            <MainBanner />
            <PopularProducts />
            <EventBanner posts={items} />
        </>
    );
}
