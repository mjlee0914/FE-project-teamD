'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/shared/types/action.types';
import {
    getBoard,
    getBoardCategories,
    getPost,
    updatePost,
} from '../lib/boardRepository';
import { getCurrentUser } from '../lib/currentUser';
import { canEditPost } from '../lib/permissions';
import { validatePost } from '../lib/validatePost';
import { pickImage, toDataUrl } from '../lib/imageUpload';
import type { Post } from '../types/board.types';

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
        rating: String(formData.get('rating') ?? ''),
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

    const categories = await getBoardCategories(board.id);

    // 검증 호출
    const errors = validatePost(
        board,
        formData,
        categories.map((c) => c.id),
        !!post.thumbnail_url, // 기존 이미지가 있는지 여부
    );

    // 새로 고른 파일이 있을 때만 data URL로 변환 (안 골랐으면 기존 이미지 유지)
    const usesImage = board.type === 'gallery' || board.use_thumbnail;
    const image = usesImage ? pickImage(formData) : null;
    const thumbnailUrl = image ? await toDataUrl(image) : undefined;

    if (Object.keys(errors).length > 0) return fail(errors);

    let updated: Post | null = null;
    try {
        updated = await updatePost(board.id, post.id, {
            title: values.title.trim(),
            content: values.content.trim(),
            categoryId: board.use_category ? values.category : undefined,
            isSecret: board.use_secret ? values.isSecret === 'on' : undefined,
            thumbnailUrl,
            rating: board.use_rating ? Number(values.rating) : undefined,
        });
    } catch (error) {
        console.error('글 수정 실패:', error);
        return fail({
            form: '글을 수정하지 못했습니다. 잠시 후에 다시 시도해주세요.',
        });
    }
    if (!updated) return fail({ form: '게시글을 찾을 수 없습니다.' });

    // 목록 갱신
    revalidatePath(`/boards/${board.id}`);
    revalidatePath(`/boards/${board.id}/${post.id}`);
    revalidatePath('/'); // 홈 배너 갱신 (이벤트 게시판일 때만 해도 됨: if (board.id === 'events'))
    redirect(`/boards/${board.id}/${post.id}`);
}
