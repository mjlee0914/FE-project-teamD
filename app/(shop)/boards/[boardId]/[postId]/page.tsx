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
import { DELETED_PRODUCT_NAME } from '@/domains/boards/lib/mask';
import { getProductNamesByIds } from '@/domains/products/queries/getProductNamesByIds.query';

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

    // 상품에 연결된 글(리뷰·상품 Q&A)이면 상품명 조회, 상품을 못 찾으면 '삭제된 상품'
    const productName = post.product_id
        ? ((await getProductNamesByIds([post.product_id]))[post.product_id] ??
          DELETED_PRODUCT_NAME)
        : undefined;

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
                productName={productName}
            />
        </div>
    );
}
