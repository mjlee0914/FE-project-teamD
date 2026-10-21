import { isCategoryType } from '../types/category.type';

export function validateCreateCategory(
    formData: FormData,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = formData.get('name');
    const type = formData.get('type');

    if (typeof name !== 'string' || !name.trim()) {
        errors.name = '카테고리명을 입력해주세요.';
    }

    if (typeof type !== 'string' || !isCategoryType(type)) {
        errors.type = '카테고리 구분을 선택해주세요.';
    }

    return errors;
}

export function validateUpdateCategory(
    formData: FormData,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = formData.get('name');
    const id = formData.get('id');

    if (typeof name !== 'string' || !name.trim()) {
        errors.name = '카테고리명을 입력해주세요.';
    }

    if (typeof id !== 'string' || !id.trim()) {
        errors.id = '수정할 카테고리를 선택해주세요';
    }

    return errors;
}
