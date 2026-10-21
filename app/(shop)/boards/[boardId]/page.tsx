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
import { getProductNamesByIds } from '@/domains/products/queries/getProductNamesByIds.query';
import PhotoFilter from '@/domains/boards/components/PhotoFilter';

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
        photo?: string; // '1': 포토 리뷰만, '0': 일반 리뷰만 (분류가 아니라 이미지 유무)
    }>;
}) {
    const { boardId } = await params;
    const sp = await searchParams;
    const page = Number(sp.page) || 1; // 같은 값은 NaN → 1

    // 404 에러 해소용 임시 반환값
    // return <div>게시판: {boardId}</div>;

    const board = await getBoard(boardId);
    if (!board) notFound();

    // 포토/일반 리뷰 필터: ?photo=1 → true, ?photo=0 → false, 없으면 전체
    const hasImage =
        sp.photo === '1' ? true : sp.photo === '0' ? false : undefined;

    const result = await getPosts({
        boardId,
        page,
        q: sp.q,
        category: sp.category,
        // 갤러리이면 12장, undefined이면 구조분해기본값 (10줄)
        pageSize: board.type === 'gallery' ? 12 : undefined,
        productId: sp.productId,
        hasImage,
    });

    // 칩·검색·페이지 이동 중에도 유지할 쿼리 (조건이 늘면 여기에만 추가)
    const extraQuery = { productId: sp.productId, photo: sp.photo };

    // 쓰기 권한이 있을 때만 글쓰기 버튼을 보여 줌
    // 리뷰처럼 반드시 상품에 속한 글은 상품페이지에서 쓰므로 목록에서는 글쓰기 버튼을 숨김
    const user = await getCurrentUser();
    const canWrite =
        canWriteBoard(board, user) && board.product_scope !== 'required';

    // 분류 목록
    const categories = await getBoardCategories(boardId);

    const productIds = result.items
        .map((p) => p.product_id)
        .filter((id): id is string => !!id);

    const productNames =
        board.product_scope && board.product_scope !== 'none'
            ? await getProductNamesByIds(productIds)
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

                    {/* 썸네일을 쓰는 게시판(리뷰): 전체 / 포토 리뷰 / 일반 리뷰 */}
                    {board.use_thumbnail && (
                        <PhotoFilter
                            basePath={`/boards/${board.id}`}
                            photo={sp.photo}
                            query={{
                                q: sp.q,
                                category: sp.category,
                                productId: sp.productId,
                            }}
                        />
                    )}

                    <BoardToolbar
                        board={board}
                        q={sp.q}
                        category={sp.category}
                        extraQuery={extraQuery}
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
                            ...extraQuery,
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
                        maskAuthor={board.write_role !== 'admin'}
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
