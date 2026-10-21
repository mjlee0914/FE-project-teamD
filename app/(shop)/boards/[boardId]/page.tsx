import {
    getBoard,
    getBoardCategories,
    getPosts,
} from '@/domains/boards/lib/boardRepository';
import { notFound } from 'next/navigation';
import BoardHeader from '@/domains/boards/components/BoardHeader';
import PostList from '@/domains/boards/components/PostList';
import Pagination from '@/domains/boards/components/Pagination';
import BoardToolbar from '@/domains/boards/components/BoardToolbar';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import { canWriteBoard } from '@/domains/boards/lib/permissions';
import AskQnaBox from '@/domains/boards/components/AskQnaBox';
import PostGallery from '@/domains/boards/components/PostGallery';
import Link from 'next/link';
import { getProductnamesByIds } from '@/domains/products/queries/getProductById.query';

export default async function BoardPage({
    params,
    searchParams,
}: {
    params: Promise<{ boardId: string }>;
    searchParams: Promise<{
        page?: string;
        q?: string;
        category?: string;
        productId?: string;
    }>;
}) {
    const { boardId } = await params;
    const sp = await searchParams;
    const page = Number(sp.page) || 1; // 같은 값은 NaN → 1

    // 404 에러 해소용 임시 반환값
    // return <div>게시판: {boardId}</div>;

    const board = await getBoard(boardId);
    if (!board) notFound();

    const result = await getPosts({
        boardId,
        page,
        q: sp.q,
        category: sp.category,
        // 갤러리이면 12장, undefined이면 구조분해기본값 (10줄)
        pageSize: board.type === 'gallery' ? 12 : undefined,
        productId: sp.productId,
    });

    // 쓰기 권한이 있을 때만 글쓰기 버튼을 보여 줌
    const user = await getCurrentUser();
    const canWrite = canWriteBoard(board, user);

    // 분류 목록
    const categories = await getBoardCategories(boardId);

    const productIds = result.items
        .map((p) => p.product_id)
        .filter((id): id is string => !!id);

    const productNames =
        board.product_scope && board.product_scope !== 'none'
            ? await getProductnamesByIds(productIds)
            : {};

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <BoardHeader board={board} />
            {board.type === 'list' || board.type === 'qna' ? (
                <>
                    {sp.productId && (
                        <p className="mb-3 text-xs text-gray-500">
                            지금은 선택한 상품의 게시글만 보고 있어요!{' '}
                            <Link
                                href={`/boards/${boardId}`}
                                className="underline"
                            >
                                전체 상품 리뷰 보기
                            </Link>
                        </p>
                    )}

                    <BoardToolbar
                        board={board}
                        q={sp.q}
                        category={sp.category}
                        productId={sp.productId}
                        canWrite={canWrite}
                        categories={categories}
                    />
                    <PostList
                        board={board}
                        posts={result.items}
                        total={result.total}
                        page={result.page}
                        pageSize={result.pageSize}
                        categories={categories}
                        productNames={productNames}
                    />
                    <Pagination
                        basePath={`/boards/${board.id}`}
                        page={result.page}
                        totalPages={result.totalPages}
                        query={{
                            q: sp.q,
                            category: sp.category,
                            productId: sp.productId,
                        }}
                    />
                    {board.id === 'faq' && <AskQnaBox />}
                </>
            ) : (
                <>
                    <BoardToolbar
                        board={board}
                        q={sp.q}
                        category={sp.category}
                        canWrite={canWrite}
                        categories={categories}
                    />
                    <PostGallery
                        boardId={board.id}
                        posts={result.items}
                        layout={board.gallery_layout}
                        categories={categories}
                    />
                    <Pagination
                        basePath={`/boards/${board.id}`}
                        page={result.page}
                        totalPages={result.totalPages}
                        query={{ q: sp.q, category: sp.category }}
                    />
                </>
            )}
        </div>
    );
}
