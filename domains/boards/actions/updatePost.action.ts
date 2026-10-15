'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/shared/types/action.types';
import { getBoard, getPost, updatePost } from '../lib/boardRepository';
import { getCurrentUser } from '../lib/currentUser';
import { canEditPost } from '../lib/permissions';
import { validatePost } from '../lib/validatePost';

// 공개요청
export async function updatePostAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const boardId = String(formData.get('boardId') ?? '');
    const postId = String(formData.get('postId') ?? '');

    const values = {
        category: String(formData.get('category') ?? ''),
        title: String(formData.get('title') ?? ''),
        content: String(formData.get('content') ?? ''),
        isSecret: formData.get('isSecret') ? 'on' : '',
    };
    const fail = (errors: Record<string, string>): ActionState => ({
        success: false,
        errors,
        values,
    });

    const board = await getBoard(boardId);
    if (!board) return fail({ form: '게시판을 찾을 수 없습니다.' });

    const post = await getPost(board.id, postId);
    if (!post) return fail({ form: '게시글을 찾을 수 없습니다.' });

    const user = await getCurrentUser();
    if (!canEditPost(post, user))
        return fail({ form: '수정 권한이 없습니다.' });

    const errors = validatePost(board, formData);
    if (Object.keys(errors).length > 0) return fail(errors);

    await updatePost(board.id, post.id, {
        title: values.title.trim(),
        content: values.content.trim(),
        category: board.use_category ? values.category : undefined,
        isSecret: board.use_secret ? values.isSecret === 'on' : undefined,
    });

    // 목록 갱신
    revalidatePath(`/boards/${board.id}`);
    revalidatePath(`/boards/${board.id}/${post.id}`);
    redirect(`/boards/${board.id}/${post.id}`);
}
