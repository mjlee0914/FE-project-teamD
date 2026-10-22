import EventSwiper from './EventSwiper';
import Link from 'next/link';
import type { Post } from '@/domains/boards/types/board.types';

interface EventBannerProps {
    posts: Post[];
}

export default function EventBanner({ posts }: EventBannerProps) {
    const visiblePosts = posts.filter(
        (post) =>
            post.board_id === 'events' &&
            post.deleted_at === null &&
            // (코드 삭제 대신 주석처리
            // → 종료된 이벤트는 메인 page.tsx에서 처리합니다. 확인되시면 주석 삭제하셔도 됩니다.
            post.thumbnail_url,
    );

    if (visiblePosts.length === 0) return null;

    return (
        <>
            <section className="p-20 pb-40">
                <div className="mb-8 flex items-end justify-between px-10">
                    <div className="flex flex-col gap-4">
                        <p className="tracking-widest text-zinc-500">EVENT</p>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                            진행 중 이벤트
                        </h1>
                    </div>
                    <Link href="/boards/events" className="text-sm underline">
                        전체 이벤트
                    </Link>
                </div>
                <EventSwiper post={visiblePosts}></EventSwiper>
            </section>
        </>
    );
}
