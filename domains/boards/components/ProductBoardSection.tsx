import Link from 'next/link';
import { getPosts } from '../lib/boardRepository';
import { formatDate } from '../lib/formatDate';
import { maskName, SECRET_TITLE } from '../lib/mask';

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
    const { items, total } = await getPosts({
        boardId,
        productId,
        pageSize: 5,
    });
    const isQna = boardId === 'qna';

    if (items.length === 0) {
        return (
            <div className="border-y border-gray-200 py-16 text-center">
                <p className="text-sm text-gray-500">{emptyText}</p>
            </div>
        );
    }

    return (
        <div>
            <ul className="border-y border-gray-200 text-sm">
                {items.map((post) => (
                    <li
                        key={post.id}
                        className="flex items-center gap-4 border-b px-2 py-3 last:border-b-0"
                    >
                        {post.rating ? (
                            <span className="text-xs text-amber-500">
                                {'★'.repeat(post.rating)}
                                {'☆'.repeat(5 - post.rating)}
                            </span>
                        ) : null}
                        <Link
                            href={`/boards/${boardId}/${post.id}`}
                            className="min-w-0 flex-1 truncate hover:underline"
                        >
                            {isQna && post.is_secret
                                ? SECRET_TITLE
                                : post.title}
                        </Link>
                        <span className="w-16 text-center text-xs text-gray-500">
                            {isQna
                                ? maskName(post.author_name)
                                : post.author_name}
                        </span>
                        <span className="w-24 text-center text-xs text-gray-500">
                            {formatDate(post.created_at)}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="mt-3 text-right">
                <Link
                    href={`/boards/${boardId}?productId=${productId}`}
                    className="text-xs underline"
                >
                    전체 보기 → ({total})
                </Link>
            </div>
        </div>
    );
}
