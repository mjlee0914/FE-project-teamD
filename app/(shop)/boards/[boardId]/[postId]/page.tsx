import { notFound } from 'next/navigation';
import {
    getAdjacentPosts,
    getBoard,
    getPost,
    increaseViewCount,
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
    let shownPost = post;
    if (canView) {
        try {
            await increaseViewCount(boardId, postId);
            // 이미 읽은 글은 +1 전 값이 있으므로 화면에는 +1을 반영
            shownPost = { ...post, view_count: post.view_count + 1 };
        } catch (error) {
            // 조회수 갱신 실패는 글을 못 보게 할 이유는 아니니까 알리지 않음
            console.error('조회수 증가 실패:', error);
        }
    }

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
                post={shownPost}
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
