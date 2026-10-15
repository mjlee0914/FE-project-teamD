// main landing page

import EventBanner from '@/domains/home/components/EventBanner';
import PopularProducts from '@/domains/home/components/PopularProducts';
import MainBanner from '@/domains/home/components/MainBanner';

export default function HomePage() {
    return (
        <>
            <MainBanner></MainBanner>
            <PopularProducts></PopularProducts>
            <EventBanner></EventBanner>
        </>
    );
}
