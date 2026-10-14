import { getBoard, getPosts } from '@/domains/boards/lib/boardRepository';
import { notFound } from 'next/navigation';
import BoardHeader from '@/domains/boards/components/BoardHeader';
import PostList from '@/domains/boards/components/PostList';
import Pagination from '@/domains/boards/components/Pagination';
import BoardToolbar from '@/domains/boards/components/BoardToolbar';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import { canWriteBoard } from '@/domains/boards/lib/permissions';
import Link from 'next/link';

export default async function BoardPage({
    params,
    searchParams,
}: {
    params: Promise<{ boardId: string }>;
    searchParams: Promise<{ page?: string; q?: string; category?: string }>;
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
    });

    // 쓰기 권한이 있을 때만 글쓰기 버튼을 보여 줌
    const user = await getCurrentUser();
    const canWrite = canWriteBoard(board, user);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <BoardHeader board={board} />
            {board.type === 'list' ? (
                <>
                    <BoardToolbar
                        board={board}
                        q={sp.q}
                        category={sp.category}
                    />
                    <PostList
                        board={board}
                        posts={result.items}
                        total={result.total}
                        page={result.page}
                        pageSize={result.pageSize}
                    />
                    <Pagination
                        basePath={`/boards/${board.id}`}
                        page={result.page}
                        totalPages={result.totalPages}
                        query={{ q: sp.q, category: sp.category }}
                    />
                    {canWrite && (
                        <div className="mt-2 flex justify-end">
                            <Link
                                href={`/boards/${board.id}/new`}
                                className="w-[4.5rem] border border-black bg-black py-1.5 text-center text-xs text-white"
                            >
                                글쓰기
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                // 객체를 글자로 바꾸고(JSON.stringify) JSON 모양 그대로 출력하기(pre)
                <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    );
}
