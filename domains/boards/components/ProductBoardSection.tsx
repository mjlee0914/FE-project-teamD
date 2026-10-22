import Link from 'next/link';
import { getBoard, getBoardCategories, getPosts } from '../lib/boardRepository';
import PostList from './PostList';

interface ProductBoardSectionProps {
    boardId: 'review' | 'qna';
    productId: string;
    emptyText: string;
}

// 상품페이지 하단용 최신 게시물 불러오기
export default async function ProductBoardSection({
    boardId,
    productId,
    emptyText,
}: ProductBoardSectionProps) {
    const { items, total, page, pageSize } = await getPosts({
        boardId,
        productId,
        pageSize: 5,
    });
    const writeLabel = boardId === 'review' ? '리뷰 쓰기' : '문의 하기';

    const board = await getBoard(boardId);
    if (!board) return null;
    const categories = await getBoardCategories(boardId);

    if (items.length === 0) {
        return (
            <div>
                <div className="border-y border-gray-200 py-16 text-center">
                    <p className="text-sm text-gray-500">{emptyText}</p>
                </div>
                <div className="mt-3 flex items-center justify-end gap-3">
                    <Link
                        href={`/boards/${boardId}/new?productId=${productId}`}
                        className="border border-black bg-black px-4 py-1.5 text-xs text-white"
                    >
                        {writeLabel}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PostList
                board={board}
                posts={items}
                total={total}
                page={page}
                pageSize={pageSize}
                categories={categories}
                hideProduct // 이 상품 페이지의 글이니까 상품 컬럼은 필요 없음
            />
            <div className="mt-3 flex items-center justify-end gap-3">
                <Link
                    href={`/boards/${boardId}?productId=${productId}`}
                    className="border border-black bg-white px-4 py-1.5 text-xs text-black"
                >
                    전체 보기
                </Link>
                <Link
                    href={`/boards/${boardId}/new?productId=${productId}`}
                    className="border border-black bg-black px-4 py-1.5 text-xs text-white"
                >
                    {writeLabel}
                </Link>
            </div>
        </div>
    );
}
