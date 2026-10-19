import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getBoard,
    getBoardCategories,
} from '@/domains/boards/lib/boardRepository';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import { canWriteBoard } from '@/domains/boards/lib/permissions';
import { io } from 'next/cache';
import PostForm from '@/domains/boards/components/PostForm';

// 새 글 작성
export default async function NewPostPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;
    const board = await getBoard(boardId);
    if (!board) notFound();

    const user = await getCurrentUser();

    // 권한 없으면 안내
    if (!canWriteBoard(board, user)) {
        const message =
            board.write_role === 'admin'
                ? `${board.name}은 관리자만 작성할 수 있습니다.`
                : '로그인 후 작성할 수 있습니다.';
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                    <p className="text-3xl">⛔</p>
                    <h3 className="mt-1.5 mb-1 text-base font-bold">
                        작성 권한이 없습니다.
                    </h3>
                    <p className="mb-3.5 text-xs text-gray-500">{message}</p>
                    <Link
                        href={`/boards/${board.id}`}
                        className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                    >
                        목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const categories = await getBoardCategories(board.id);

    await io();
    const gid = crypto.randomUUID();

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8 border-b pb-6">
                <p className="text-muted-foreground text-xs tracking-widest">
                    NEW POST
                </p>
                <h1 className="mt-1 text-2xl font-bold">새 글 작성</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    {board.name}
                </p>
            </header>
            <PostForm board={board} gid={gid} categories={categories} />
        </div>
    );
}
