import type { Post } from '@/domains/boards/types/board.types';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
    post: Post;
}

export default function EventCard({ post }: EventCardProps) {
    const imageSrc = post.thumbnail_url?.replace(/^public\//, '/');

    if (!imageSrc) return null;

    return (
        <>
            <div className="relative block aspect-14/6 w-200 overflow-hidden bg-white">
                <Link href={`/boards/events/${post.id}`}>
                    <Image
                        src={imageSrc}
                        fill
                        alt={post.title}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                    ></Image>
                    <div className="absolute bottom-5 flex flex-col gap-1 p-5 text-white">
                        <h1 className="text-3xl font-extrabold">
                            {post.title}
                        </h1>
                        <p className="pl- font-semibold">{post.content}</p>
                    </div>
                </Link>
            </div>
        </>
    );
}
