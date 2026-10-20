import Link from 'next/link';
import { formatDate } from '../lib/formatDate';
import type { BoardSetting, Post } from '../types/board.types';
import DeleteButton from './DeleteButton';
import QnaAnswer from './QnaAnswer';
import AnswerForm from './AnswerForm';
import { maskName, SECRET_TITLE } from '../lib/mask';

interface PostDetailProps {
    board: BoardSetting;
    post: Post;
    prev: Post | null;
    next: Post | null;
    canEdit: boolean;
    canView: boolean;
    canAnswer: boolean;
}

// 이벤트가 없어서 use client 불필요
export default function PostDetail({
    board,
    post,
    prev,
    next,
    canEdit,
    canView,
    canAnswer,
}: PostDetailProps) {
    const listHref = `/boards/${board.id}`;
    const isQna = board.type === 'qna';
    const hidden = post.is_secret && !canView;

    // 목록에서 가린 비밀글 제목이 이전/다음 글 줄에서 보이지 않게
    const showTitle = (p: Post) => (p.is_secret ? SECRET_TITLE : p.title);

    return (
        <article>
            {/* 경로 표시 */}
            <p className="mb-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">
                    홈
                </Link>{' '}
                ＞{' '}
                <Link href={listHref} className="hover:underline">
                    {board.name}
                </Link>
            </p>

            <header className="border-t-2 border-b border-black px-1.5 py-4">
                {/* {board.use_category && post.category && (
                    <p className="text-xs font-bold text-stone-500">
                        {post.category}
                    </p>
                )} */}
                <h1 className="my-1 text-xl font-extrabold">
                    {hidden ? SECRET_TITLE : post.title}
                </h1>
                <p className="text-xs text-gray-500">
                    {isQna ? maskName(post.author_name) : post.author_name} ·{' '}
                    {formatDate(post.created_at)} · 조회수 {post.view_count}
                </p>
            </header>

            <div className="min-h-40 border-b px-1.5 py-6 text-sm whitespace-pre-wrap text-gray-700">
                {hidden
                    ? '🔒 작성자와 관리자만 볼 수 있는 글입니다.'
                    : post.content}
            </div>

            {/* 답변: 볼 수 있을 때만 (비밀글을 못 보는 사람에게는 답변도 그리지 않음) */}
            {!hidden && post.answer && <QnaAnswer answer={post.answer} />}
            {!hidden && isQna && !post.answer && (
                <p className="border-b px-4 py-5 text-xs text-gray-400">
                    답변 대기 중
                </p>
            )}
            {canAnswer && (
                <AnswerForm
                    boardId={board.id}
                    postId={post.id}
                    current={post.answer?.content}
                />
            )}

            <ul className="border-b text-xs">
                <li className="flex gap-4 px-1.5 py-2.5">
                    <b className="w-14 font-medium text-gray-500">이전 글</b>
                    {prev ? (
                        <Link
                            href={`${listHref}/${prev.id}`}
                            className="hover:underline"
                        >
                            {showTitle(prev)}
                        </Link>
                    ) : (
                        <span className="text-gray-400">
                            이전 글이 없습니다.
                        </span>
                    )}
                </li>
                <li className="flex gap-4 px-1.5 py-2.5">
                    <b className="w-14 font-medium text-gray-500">다음 글</b>
                    {next ? (
                        <Link
                            href={`${listHref}/${next.id}`}
                            className="hover:underline"
                        >
                            {showTitle(next)}
                        </Link>
                    ) : (
                        <span className="text-gray-400">
                            다음 글이 없습니다.
                        </span>
                    )}
                </li>
            </ul>

            <div className="mt-4 flex justify-between">
                <Link
                    href={listHref}
                    className="border border-black px-4 py-1.5 text-xs"
                >
                    목록
                </Link>

                {canEdit && (
                    <div className="flex gap-2">
                        <Link
                            href={`${listHref}/${post.id}/edit`}
                            className="w-[4.5rem] border border-black py-1.5 text-center text-xs"
                        >
                            수정
                        </Link>
                        <DeleteButton boardId={board.id} postId={post.id} />
                    </div>
                )}
            </div>
        </article>
    );
}
