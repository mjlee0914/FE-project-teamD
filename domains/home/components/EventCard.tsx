import type { Post } from '@/domains/boards/types/board.types';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
    post: Post;
}

export default function EventCard({ post }: EventCardProps) {
    const imageSrc = post.thumbnail_url?.replace(/^public\//, '/');

    return (
        <>
            <div className="relative aspect-[10/5] w-200 overflow-hidden bg-white">
                <Link href={`/boards/events/${post.id}`}>
                    <Image
                        src={imageSrc}
                        fill
                        alt={post.title}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                    ></Image>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-white">
                        <h1>{post.title}</h1>
                        <p>{post.content}</p>
                    </div>
                </Link>
            </div>
        </>
    );
}
