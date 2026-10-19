import EventSwiper from './EventSwiper';
import Link from 'next/link';
import type { Post } from '@/domains/boards/types/board.types';

interface EventBannerProps {
    posts: Post[];
}

export default function EventBanner({ posts }: EventBannerProps) {
    const visiblePosts = posts.filter(
        (post) =>
            post.board_id === 'promotion' &&
            post.deleted_at === null &&
            post.category_id !== 'cat-promotion-ended' &&
            post.thumbnail_url,
    );

    if (visiblePosts.length === 0) return null;

    return (
        <>
            <section className="p-20">
                <div className="mb-4 flex items-center justify-between p-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        진행 중 이벤트
                    </h1>

                    <Link href="/boards/events">
                        <p className="cursor-pointer text-sm underline">
                            전체 이벤트
                        </p>
                    </Link>
                </div>
                <EventSwiper post={visiblePosts}></EventSwiper>
            </section>
        </>
    );
}
