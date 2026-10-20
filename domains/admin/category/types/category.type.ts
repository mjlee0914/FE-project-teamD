// 구분을 추가하거나 이름을 바꿀 때는 이 목록만 수정합니다.
export const CATEGORY_TYPES = [
    { value: 'MAIN', label: '상품' },
    { value: 'BOARD', label: '게시판' },
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number]['value'];

export function isCategoryType(value: string) {
    for (const type of CATEGORY_TYPES) {
        if (type.value === value) {
            return true;
        }
    }

    return false;
}

export interface Category {
    id: string;
    parent_id: string;
    name: string;
    depth: number;
    sort_order: number;
    type: CategoryType;
    created_at: string;
    deleted_at: string | null;
}

export interface addCategoryType {
    name: string;
    parent_id?: string;
    type: CategoryType;
}

export interface saveCategoryType {
    id?: string;
    name: string;
    parent_id: string;
    type: CategoryType;
    deleted_at?: string;
}
