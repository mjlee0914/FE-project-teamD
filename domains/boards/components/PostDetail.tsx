import Link from 'next/link';
import { formatDate } from '../lib/formatDate';
import type { BoardSetting, Post } from '../types/board.types';
import DeleteButton from './DeleteButton';

interface PostDetailProps {
    board: BoardSetting;
    post: Post;
    prev: Post | null;
    next: Post | null;
    canEdit: boolean;
}

// 이벤트가 없어서 use client 불필요
export default function PostDetail({
    board,
    post,
    prev,
    next,
    canEdit,
}: PostDetailProps) {
    const listHref = `/boards/${board.id}`;

    return (
        <article>
            {/* 경로 표시 */}
            <p className="mb-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">
                    홈
                </Link>{' '}
                ＞{' '}
                <Link href={listHref} className="hover:underline">
                    {board.name}
                </Link>
            </p>

            <header className="border-t-2 border-b border-black px-1.5 py-4">
                {/* {board.use_category && post.category && (
                    <p className="text-xs font-bold text-stone-500">
                        {post.category}
                    </p>
                )} */}
                <h1 className="my-1 text-xl font-extrabold">{post.title}</h1>
                <p className="text-xs text-gray-500">
                    {post.author_name} · {formatDate(post.created_at)} ·
                    조회수{' '}
                </p>
            </header>

            <div className="min-h-40 border-b px-1.5 py-6 text-sm whitespace-pre-wrap text-gray-700">
                {post.content}
            </div>

            <ul className="border-b text-xs">
                <li className="flex gap-4 px-1.5 py-2.5">
                    <b className="w-14 font-medium text-gray-500">이전 글</b>
                    {prev ? (
                        <Link
                            href={`${listHref}/${prev.id}`}
                            className="hover:underline"
                        >
                            {prev.title}
                        </Link>
                    ) : (
                        <span className="text-gray-400">
                            이전 글이 없습니다.
                        </span>
                    )}
                </li>
                <li className="flex gap-4 px-1.5 py-2.5">
                    <b className="w-14 font-medium text-gray-500">다음 글</b>
                    {next ? (
                        <Link
                            href={`${listHref}/${next.id}`}
                            className="hover:underline"
                        >
                            {next.title}
                        </Link>
                    ) : (
                        <span className="text-gray-400">
                            다음 글이 없습니다.
                        </span>
                    )}
                </li>
            </ul>

            <div className="mt-4 flex justify-between">
                <Link
                    href={listHref}
                    className="border border-black px-4 py-1.5 text-xs"
                >
                    목록
                </Link>

                {canEdit && (
                    <div className="flex gap-2">
                        <Link
                            href={`${listHref}/${post.id}/edit`}
                            className="w-[4.5rem] border border-black py-1.5 text-center text-xs"
                        >
                            수정
                        </Link>
                        <DeleteButton boardId={board.id} postId={post.id} />
                    </div>
                )}
            </div>
        </article>
    );
}
