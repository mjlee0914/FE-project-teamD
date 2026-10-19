import { formatDate } from '../lib/formatDate';
import type {
    BoardSetting,
    CategoryOption,
    Post,
} from '../types/board.types';
import Link from 'next/link';

interface PostListProps {
    board: BoardSetting;
    posts: Post[];
    total: number; // 게시물 번호 계산용
    page: number;
    pageSize: number;
    categories: CategoryOption[]; // 분류 id → 이름 변환용
}

export default function PostList({
    board,
    posts,
    total,
    page,
    pageSize,
    categories,
}: PostListProps) {
    // 고정글 강조 및 페이징이 연번을 해치지 않게 하기
    const offset = (page - 1) * pageSize;

    if (posts.length === 0) {
        return (
            <p className="text-muted-foreground py-16 text-center text-sm">
                등록된 게시글이 없습니다.
            </p>
        );
    }

    return (
        <table className="w-full border-t-2 border-t-black text-sm">
            <thead>
                <tr className="border-b text-center">
                    <th className="w-16 py-3">No.</th>
                    {board.use_category && <th className="w-24">분류</th>}
                    <th>제목</th>
                    <th className="w-24">작성자</th>
                    <th className="w-28">작성일</th>
                    <th className="w-16">조회수</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, i) => (
                    <tr
                        key={post.id}
                        className={`${post.is_pinned ? 'bg-stone-100 font-semibold' : ''} border-b`}
                    >
                        <td className="py-3 text-center">
                            {post.is_pinned ? '📌' : total - offset - i}
                        </td>
                        {board.use_category && (
                            <td className="text-center">
                                {categories.find(
                                    (c) => c.id === post.category_id,
                                )?.name ?? ''}
                            </td>
                        )}
                        {/* 제목을 클릭하면 해당 게시물로 이동 */}
                        <td>
                            <Link
                                href={`/boards/${board.id}/${post.id}`}
                                className="hover:underline"
                            >
                                {post.title}
                            </Link>
                        </td>
                        <td className="text-center">{post.author_name}</td>
                        <td className="text-center">
                            {formatDate(post.created_at)}
                        </td>
                        <td className="text-center">{post.view_count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
