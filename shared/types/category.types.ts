// category 테이블 type 컬럼 값 (DB 저장값은 대문자로 가정, 미확정)
export const CATEGORY_TYPES = [
    { value: 'MAIN', label: '상품' },
    { value: 'BOARD', label: '게시판' },
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number]['value'];
