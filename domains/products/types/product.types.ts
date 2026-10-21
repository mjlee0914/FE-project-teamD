import { Category } from '@/domains/categories/types/category.types';

export interface Product {
    id: string; // 상품 고유 식별자
    gid: number; // ERD의 file_info.gid와 연결하는 파일 그룹 ID
    name: string; // 상품명
    price: number; // 가격 (원화 기준 숫자)
    category_id: string; // 카테고리 분류
    imageUrl: string; // 이미지 URL (무료 이미지 또는 대체 이미지)
    description: string; // 상품 요약 설명
    isNew?: boolean; // 신상품 여부 (선택 속성)
    viewCount?: number; // 조회수

    category?: Category;
}
