import { User } from '@/domains/auth/types/auth.types';
import { BoardSetting } from '@/domains/boards/types/board.types';
import { Category } from '@/domains/categories/types/category.types';
import { FileInfo } from '@/domains/files/types/file.types';
import { Product } from '@/domains/products/types/product.types';

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

// 로그인 테스트용 회원 관리자, 테스트 Mock Data
export const MOCK_USERS: User[] = [
    {
        id: 1,
        loginId: 'admin',
        password: 'admin',
        name: '관리자',
    },
    {
        id: 2,
        loginId: 'test',
        password: 'test',
        name: '테스터',
    },
];

// 상품 Mock Data
export const MOCK_PRODUCTS: Product[] = [
   {
    id: 1,
    name: '아노락 재킷',
    price: 79000,
    category_id: 'outer',
    imageUrl: '/products/Black-anorak.png',
    description:
        '심플한 디자인에 스트릿 무드를 더한 오버핏 아노락. 여유로운 핏과 깔끔한 실루엣으로 편안하면서도 트렌디한 데일리룩을 완성할 수 있습니다.',
    isNew: true,
    viewCount: 349,
    },
    {
        id: 2,
        name: '데일리 코튼 티셔츠',
        price: 19900,
        category_id: 'tops',
        imageUrl: 'https://placehold.co/600x800?text=T-shirt',
        description: '부드러운 코튼 소재로 매일 입기 좋은 기본 티셔츠입니다.',
        isNew: false,
        viewCount: 246,
    },
    {
        id: 3,
        name: '스트레이트 데님 팬츠',
        price: 42000,
        category_id: 'bottoms',
        imageUrl: 'https://placehold.co/600x800?text=Jeans',
        description: '깔끔한 일자 핏으로 캐주얼하게 입기 좋은 데님 팬츠입니다.',
        isNew: true,
        viewCount: 93,
    },
    {
        id: 4,
        name: '베이직 니트 가디건',
        price: 35900,
        category_id: 'outer',
        imageUrl: 'https://placehold.co/600x800?text=Cardigan',
        description: '간절기에 가볍게 걸치기 좋은 기본 가디건입니다.',
        isNew: false,
        viewCount: 175,
    },
    {
        id: 5,
        name: '클래식 캔버스 스니커즈',
        price: 49000,
        category_id: 'shoes',
        imageUrl: 'https://placehold.co/600x800?text=Sneakers',
        description: '데일리 룩에 잘 어울리는 심플한 캔버스 스니커즈입니다.',
        isNew: false,
        viewCount: 311,
    },
];
