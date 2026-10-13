import { getBoard, getPosts } from '@/domains/boards/lib/boardRepository';
import { notFound } from 'next/navigation';
import BoardHeader from '@/domains/boards/components/BoardHeader';
import PostList from '@/domains/boards/components/PostList';

export default async function BoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;

    // 404 에러 해소용 임시 반환값
    // return <div>게시판: {boardId}</div>;

    const board = await getBoard(boardId);
    if (!board) notFound();

    const result = await getPosts({ boardId });

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <BoardHeader board={board} />
            {board.type === 'list' ? (
                <PostList
                    board={board}
                    posts={result.items}
                    total={result.total}
                />
            ) : (
                // 객체를 글자로 바꾸고(JSON.stringify) JSON 모양 그대로 출력하기(pre)
                <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    );
}
