import { isCategoryType } from '../types/category.type';

export function validateCreateCategory(
    formData: FormData,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = formData.get('name');
    const parentId = formData.get('parent_id');
    const type = formData.get('type');

    if (typeof name !== 'string' || !name.trim()) {
        errors.name = '카테고리명을 입력해주세요.';
    } else if (Array.from(name.trim()).length > 100) {
        errors.name = '카테고리명은 100자 이내로 입력해주세요.';
    }

    if (parentId !== null && typeof parentId !== 'string') {
        errors.parent_id = '올바른 상위 카테고리를 선택해주세요.';
    } else if (
        typeof parentId === 'string' &&
        Array.from(parentId.trim()).length > 255
    ) {
        errors.parent_id = '올바른 상위 카테고리를 선택해주세요.';
    }

    if (typeof type !== 'string' || !isCategoryType(type)) {
        errors.type = '카테고리 구분을 선택해주세요.';
    }

    return errors;
}
