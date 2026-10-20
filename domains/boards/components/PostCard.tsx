import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../lib/formatDate';
import type { Post } from '../types/board.types';

interface PostCardProps {
    boardId: string;
    post: Post;
    aspect: string; // 이미지 비율
    categoryName?: string;
}

// 갤러리 카드 한 장
export default function PostCard({
    boardId,
    post,
    aspect,
    categoryName,
}: PostCardProps) {
    const src = post.thumbnail_url?.replace(/^public\//, '/');

    return (
        <Link href={`/boards/${boardId}/${post.id}`} className="group block">
            <div className={`relative overflow-hidden bg-stone-100 ${aspect}`}>
                {src ? (
                    <Image
                        src={src}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition group-hover:opacity-80"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        이미지 없음
                    </div>
                )}
            </div>
            <p className="mt-2 truncate text-sm font-medium">
                {categoryName && (
                    <span className="mr-1.5 border px-1.5 py-0.5 text-[10px] text-gray-600">
                        {categoryName}
                    </span>
                )}
                s{post.title}
            </p>
            <p className="text-xs text-gray-500">
                {post.author_name} · {formatDate(post.created_at)}
            </p>
        </Link>
    );
}
