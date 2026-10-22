import type { BoardSetting } from '../types/board.types';
import { pickImage } from './imageUpload';
import { MAX_IMAGE_BYTES, MAX_IMAGE_LABEL } from './imageLimits';

// 입력값 검증
// 지금은 클라이언트 액션을 쓰지만 나중에 바꿈
export function validatePost(
    board: BoardSetting,
    formData: FormData,
    categoryIds: string[],
    hasExistingImage = false,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const usesImage = board.type === 'gallery' || board.use_thumbnail;

    if (!title) errors.title = '제목을 입력해 주세요.';
    if (!content) errors.content = '내용을 입력해 주세요.';

    if (board.use_category && !categoryIds.includes(category)) {
        errors.category = '분류를 선택해 주세요.';
    }

    if (usesImage) {
        const file = pickImage(formData);
        // 갤러리 타입만 필수, 리뷰 게시판은 선택

        if (!file && board.type === 'gallery' && !hasExistingImage)
            errors.image = '이미지를 선택해 주세요.';
        else if (file && !file.type.startsWith('image/'))
            errors.image = '이미지 파일만 올릴 수 있습니다.';
        else if (file && file.size > MAX_IMAGE_BYTES)
            errors.image = `이미지는 ${MAX_IMAGE_LABEL} 이하로 올려 주세요.`;
    }

    if (board.use_rating) {
        const rating = Number(formData.get('rating'));
        if (!Number.isInteger(rating) || rating < 1 || rating > 5)
            errors.rating = '별점을 선택해주세요.';
    }
    return errors;
}
