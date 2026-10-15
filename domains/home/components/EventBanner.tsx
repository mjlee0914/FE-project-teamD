import EventSwiper from './EventSwiper';
import Link from 'next/link';
import { EVENT_POSTS } from '@/shared/mocks/mockData';
export default function EventBanner() {
    return (
        <>
            <section className="p-20">
                <div className="mb-4 flex items-center justify-between p-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        진행 중 이벤트
                    </h1>

                    <Link href="/boards/events">
                        <p className="text-sm underline">전체 이벤트</p>
                    </Link>
                </div>
                <EventSwiper post={EVENT_POSTS}></EventSwiper>
            </section>
        </>
    );
}
