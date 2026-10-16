// main landing page
import { EVENT_POSTS } from '@/shared/mocks/mockData';
import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';

export default function HomePage() {
    return (
        <>
            <MainBanner />
            <PopularProducts />
            <EventBanner posts={EVENT_POSTS} />
        </>
    );
}
