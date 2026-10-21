import { notFound } from 'next/navigation';
import {
    getAdjacentPosts,
    getBoard,
    getPost,
} from '@/domains/boards/lib/boardRepository';
import PostDetail from '@/domains/boards/components/PostDetail';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import {
    canAnswerPost,
    canEditPost,
    canViewPost,
} from '@/domains/boards/lib/permissions';

// 게시글 상세
export default async function PostPage({
    params,
}: {
    params: Promise<{ boardId: string; postId: string }>;
}) {
    const { boardId, postId } = await params;
    const board = await getBoard(boardId);

    if (!board) notFound();

    const post = await getPost(boardId, postId);
    if (!post) notFound();

    const user = await getCurrentUser();
    const canEdit = canEditPost(post, user);
    const canView = canViewPost(post, user);
    const canAnswer = canAnswerPost(board, user);

    const { prev, next } = await getAdjacentPosts(boardId, postId);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <PostDetail
                board={board}
                post={post}
                prev={prev}
                next={next}
                canEdit={canEdit}
                canView={canView}
                canAnswer={canAnswer}
            />
        </div>
    );
}
