import { BoardSetting } from '@/domains/boards/types/board.types';
import { Category } from '@/domains/categories/types/category.types';
import { FileInfo } from '@/domains/files/types/file.types';

// 중첩 카테고리 트리 Mock Data

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-new',
        parent_id: null,
        name: '신상품',
        depth: 1,
        sort_order: 1,
    },
    {
        id: 'cat-best',
        parent_id: null,
        name: '베스트셀러',
        depth: 1,
        sort_order: 2,
    },
    {
        id: 'cat-fashion-top',
        parent_id: null,
        name: '상의',
        depth: 1,
        sort_order: 3,
        children: [
            {
                id: 'cat-fashion-top-tshirt',
                parent_id: 'cat-fashion-top',
                name: '티셔츠',
                depth: 2,
                sort_order: 1,
            },
            {
                id: 'cat-fashion-top-shirt',
                parent_id: 'cat-fashion-top',
                name: '셔츠',
                depth: 2,
                sort_order: 2,
            },
        ],
    },
    {
        id: 'cat-fashion-bottom',
        parent_id: null,
        name: '하의',
        depth: 1,
        sort_order: 4,
        children: [
            {
                id: 'cat-fashion-bottom-denim',
                parent_id: 'cat-fashion-bottom',
                name: '데님팬츠',
                depth: 2,
                sort_order: 1,
            },
            {
                id: 'cat-fashion-bottom-slacks',
                parent_id: 'cat-fashion-bottom',
                name: '슬랙스',
                depth: 2,
                sort_order: 2,
            },
        ],
    },
    {
        id: 'cat-shoes',
        parent_id: null,
        name: '신발',
        depth: 1,
        sort_order: 5,
    },
    {
        id: 'cat-sale',
        parent_id: null,
        name: '세일상품',
        depth: 1,
        sort_order: 6,
    },
];

// 게시판 설정 Mock Data
export const MOCK_BOARDS: BoardSetting[] = [
    {
        id: 'notice',
        name: '공지사항',
        description: '쇼핑몰 공지 및 이벤트 안내',
        write_role: 'admin',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'qna',
        name: '상품 Q&A',
        description: '상품 및 배송 관련 질문 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'review',
        name: '구매 후기',
        description: '실제 구매 고객 리뷰 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
];

// 범용 파일 메타데이터 Mock Data
export const MOCK_FILES: FileInfo[] = [
    {
        id: 1,
        gid: 'product-mock-1',
        location: 'product_main',
        original_name: 'sample_product.jpg',
        content_type: 'image/jpeg',
        extension: 'jpg',
        file_size: 102400,
        done: true,
        seq: 0,
        created_at: '2026-10-13T00:00:00Z',
        url: '/files/1',
    },
];
