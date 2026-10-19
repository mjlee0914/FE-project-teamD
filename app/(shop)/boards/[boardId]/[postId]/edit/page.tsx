import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getBoard,
    getBoardCategories,
    getPost,
} from '@/domains/boards/lib/boardRepository';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import { canEditPost } from '@/domains/boards/lib/permissions';
import PostForm from '@/domains/boards/components/PostForm';

// 게시물 수정
export default async function EditPostPage({
    params,
}: {
    params: Promise<{ boardId: string; postId: string }>;
}) {
    const { boardId, postId } = await params;

    const board = await getBoard(boardId);
    if (!board || board.type !== 'list') notFound();

    const post = await getPost(boardId, postId);
    if (!post) notFound();

    // 수정 권한이 없을 때
    const user = await getCurrentUser();
    if (!canEditPost(post, user)) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                    <p className="text-3xl">⛔</p>
                    <h3 className="mt-1.5 mb-1 text-base font-bold">
                        수정 권한이 없습니다.
                    </h3>
                    <p className="mb-3.5 text-xs text-gray-500">
                        작성자 본인 또는 관리자만 수정할 수 있습니다.
                    </p>
                    <Link
                        href={`/boards/${board.id}/${post.id}`}
                        className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                    >
                        돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const categories = await getBoardCategories(board.id);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8 border-b pb-6">
                <p className="text-muted-foreground text-xs tracking-widest">
                    EDIT POST
                </p>
                <h1 className="mt-1 text-2xl font-bold">게시글 수정</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    {board.name}
                </p>
            </header>
            <PostForm
                board={board}
                gid={post.gid}
                post={post}
                categories={categories}
            />
        </div>
    );
}
