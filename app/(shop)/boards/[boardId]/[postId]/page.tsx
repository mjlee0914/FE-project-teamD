import { notFound } from 'next/navigation';
import {
    getAdjacentPosts,
    getBoard,
    getPost,
} from '@/domains/boards/lib/boardRepository';
import PostDetail from '@/domains/boards/components/PostDetail';

// 게시글 상세
export default async function PostPage({
    params,
}: {
    params: Promise<{ boardId: string; postId: string }>;
}) {
    const { boardId, postId } = await params;

    const board = await getBoard(boardId);

    if (!board) notFound();

    if (board.type !== 'list') notFound();

    if (board.type !== 'list') notFound();

    const post = await getPost(boardId, postId);

    if (!post) notFound();

    const { prev, next } = await getAdjacentPosts(boardId, postId);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <PostDetail board={board} post={post} prev={prev} next={next} />
        </div>
    );
}
