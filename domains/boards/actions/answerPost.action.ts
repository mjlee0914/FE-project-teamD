'use server';

import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/shared/types/action.types';
import { getBoard, saveAnswer } from '../lib/boardRepository';
import { getCurrentUser } from '../lib/currentUser';
import { canAnswerPost } from '../lib/permissions';

export async function answerPostAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const boardId = String(formData.get('boardId') ?? '');
    const postId = String(formData.get('postId') ?? '');
    const content = String(formData.get('content') ?? '').trim();
    const values = { content }; // 실패해도 입력한 내용 유지
    const fail = (errors: Record<string, string>): ActionState => ({
        success: false,
        errors,
        values,
    });

    const board = await getBoard(boardId);
    if (!board) return fail({ form: '게시판을 찾을 수 없습니다.' });

    // 폼 버튼을 숨겨도 요청을 직접 보내 관리자 여부 확인
    const user = await getCurrentUser();
    if (!canAnswerPost(board, user))
        return fail({ form: '답변 권한이 없습니다.' });

    if (!content) return fail({ content: '답변 내용을 입력해주세요.' });

    //user가 null이 아님을 확인하면
    const ok = await saveAnswer(board.id, postId, content, user!.name);
    if (!ok) return fail({ form: '게시글을 찾을 수 없습니다.' });

    revalidatePath(`/boards/${board.id}`); // 답변 완료
    revalidatePath(`/boards/${board.id}/${postId}`);
    return { success: true };
}
