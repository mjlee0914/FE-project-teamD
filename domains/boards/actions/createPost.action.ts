'use server'; // async 함수만 export 가능

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/shared/types/action.types';
import { createPost, getBoard } from '../lib/boardRepository';
import { getCurrentUser } from '../lib/currentUser';
import { canWriteBoard } from '../lib/permissions';
import { validatePost } from '../lib/validatePost';

// 공개요청
export async function createPostAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const boardId = String(formData.get('boardId') ?? '');

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

    // 1) 클라이언트가 보낸 id 서버 조회
    const board = await getBoard(boardId);
    if (!board) return fail({ form: '게시판을 찾을 수 없습니다.' });

    // 2) 권한 재검사 (로그인한 사용자 정보가 있어야 작성자 채우기 가능)
    const user = await getCurrentUser();
    if (!user || !canWriteBoard(board, user)) {
        return fail({ form: '작성 권한이 없습니다.' });
    }

    // 3) 검증 재실행
    const errors = validatePost(board, formData);
    if (Object.keys(errors).length > 0) return fail(errors);

    const gid = String(formData.get('gid') ?? '');
    if (!gid) return fail({ form: '잘못된 요청입니다.' });

    // 4) 저장
    await createPost({
        boardId: board.id,
        userId: user.id,
        authorName: user.name,
        title: values.title.trim(),
        content: values.content.trim(),
        gid,
        category: board.use_category ? values.category : undefined,
        isSecret: board.use_secret ? values.isSecret === 'on' : undefined,
    });

    // 5) 목록 캐시 갱신 후 목록 이동
    //  - redirect()는 이동 신호를 에러처럼 던지는 함수이기 때문에
    //  - 나중에 DB 처리하려고 try/catch 추가할 때 redirect()는 구문 안에 넣으면 안됨
    //  - 저장은 try/catch로 감싸더라도 redirect는 그 밖이나 맨 마지막에 호출해야 함

    revalidatePath(`/boards/${board.id}`);
    redirect(`/boards/${board.id}`);
}
