import { formatDate } from '../lib/formatDate';
import type { BoardSetting, Post } from '../types/board.types';

interface PostListProps {
    board: BoardSetting;
    posts: Post[];
    total: number; // 게시물 번호 계산용
    page: number;
    pageSize: number;
}

export default function PostList({
    board,
    posts,
    total,
    page,
    pageSize,
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
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b text-left">
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
                        <td className="py-3">
                            {post.is_pinned ? '📌' : total - offset - i}
                        </td>
                        {board.use_category && <td>{post.category}</td>}
                        <td>{post.title}</td>
                        <td>{post.author_name}</td>
                        <td>{formatDate(post.created_at)}</td>
                        <td className="text-right">{post.view_count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
