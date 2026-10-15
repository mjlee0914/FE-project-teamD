import type { BoardSetting } from '../types/board.types';

// 입력값 검증
// 지금은 클라이언트 액션을 쓰지만 나중에 바꿈
export function validatePost(
    board: BoardSetting,
    formData: FormData,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const category = String(formData.get('category') ?? '');

    if (!title) errors.title = '제목을 입력해 주세요.';
    if (!content) errors.content = '내용을 입력해 주세요.';

    if (board.use_category && !board.categories?.includes(category)) {
        errors.category = '분류를 선택해 주세요.';
    }
    return errors;
}
