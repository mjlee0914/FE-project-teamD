'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/shared/types/action.types';
import { deletePost, getBoard, getPost } from '../lib/boardRepository';
import { getCurrentUser } from '../lib/currentUser';
import { canEditPost } from '../lib/permissions';

// 공개요청
export async function deletePostAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const boardId = String(formData.get('boardId') ?? '');
    const postId = String(formData.get('postId') ?? '');

    const board = await getBoard(boardId);
    if (!board) {
        return {
            success: false,
            errors: { form: '게시판을 찾을 수 없습니다.' },
        };
    }

    const post = await getPost(board.id, postId);
    if (!post) {
        return {
            success: false,
            errors: { form: '게시글을 찾을 수 없습니다.' },
        };
    }

    const user = await getCurrentUser();
    if (!canEditPost(post, user)) {
        return { success: false, errors: { form: '삭제 권한이 없습니다.' } };
    }

    await deletePost(board.id, post.id);

    revalidatePath(`/boards/${board.id}`);
    revalidatePath('/'); // 홈 배너 갱신 (이벤트 게시판일 때만 해도 됨: if (board.id === 'events'))
    redirect(`/boards/${board.id}`);
}
