// main landing page

import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';

export default function HomePage() {
    return (
        <>
            <MainBanner></MainBanner>
            <PopularProducts>popular products</PopularProducts>
            <EventBanner>event banner</EventBanner>
        </>
    );
}
