import type { BoardSetting } from '../types/board.types';
import { pickImage, MAX_IMAGE_BYTES } from './imageUpload';

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

    if (!title) errors.title = '제목을 입력해 주세요.';
    if (!content) errors.content = '내용을 입력해 주세요.';

    if (board.use_category && !categoryIds.includes(category)) {
        errors.category = '분류를 선택해 주세요.';
    }

    if (board.type === 'gallery') {
        const file = pickImage(formData);
        if (!file && !hasExistingImage)
            errors.image = '이미지를 선택해 주세요.';
        else if (file && !file.type.startsWith('image/'))
            errors.image = '이미지 파일만 올릴 수 있습니다.';
        else if (file && file.size > MAX_IMAGE_BYTES)
            errors.image = '이미지는 800KB 이하로 올려주세요.';
    }
    return errors;
}
