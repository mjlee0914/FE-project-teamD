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
    category_id: 'outerwear',
    imageUrl: '/products/Black-anorak.png',
    description:
        '심플한 디자인에 스트릿 무드를 더한 오버핏 아노락. 여유로운 핏과 깔끔한 실루엣으로 편안하면서도 트렌디한 데일리룩을 완성할 수 있습니다.',
    isNew: true,
    viewCount: 349,
    },
    {
        id: 2,
        name: '밑단 스트링 후드티',
        price: 59000,
        category_id: 'tops',
        imageUrl: '/products/피치 오렌지 밑단 스트링 후드티.png',
        description: '군더더기 없는 깔끔한 디자인에 밑단 스트링 디테일을 더해, 심플하면서도 유니크한 분위기를 연출합니다. 일반적인 후드티와 달리 목 부분의 스트링을 생략하고, 밑단에 포인트를 주어 차별화된 디자인을 완성했습니다. 부드러운 피치 오렌지와 감각적인 라임 옐로우 컬러로 구성되어, 단독 착용은 물론 다양한 아우터와 레이어드하기에도 좋은 아이템입니다.',
        isNew: true,
        viewCount: 1000,
    },
    {
        id: 3,
        name: '파스텔 조거 팬츠',
        price: 42000,
        category_id: 'Pants',
        imageUrl: '/products/파스텔 조거 팬츠.png',
        description: '감각적인 컬러 조합이 돋보이는 타이다이 조거 팬츠.핑크, 옐로우, 블루 컬러가 자연스럽게 어우러져 유니크한 분위기를 연출합니다. 여유롭게 떨어지는 와이드 실루엣에 발목으로 갈수록 좁아지는 조거 스타일을 더해 캐주얼하면서도 트렌디한 핏을 완성했습니다.심플한 티셔츠나 후드티와 매치해도 스타일리시한 스트릿룩을 연출할 수 있는 포인트 아이템입니다.',
        isNew: true,
        viewCount: 1300,
    },
    {
        id: 4,
        name: '옐로우 하이넥 윈드브레이커',
        price: 81000,
        category_id: 'outerwear',
        imageUrl: '/products/바람막이.png',
        description: '일상 속 스타일에 감각적인 포인트를 더해주는 하이넥 윈드브레이커. 선명하면서도 빈티지한 머스타드 옐로우 컬러가 돋보이며, 군더더기 없는 미니멀한 디자인으로 캐주얼하면서도 세련된 분위기를 연출합니다.목을 감싸는 하이넥 디자인과 깔끔하게 떨어지는 실루엣이 특징이며, 데님 팬츠부터 와이드 팬츠까지 다양한 아이템과 자연스럽게 어우러집니다.가볍게 걸치는 것만으로도 스타일을 완성할 수 있는 데일리 아우터입니다.',
        isNew: false,
        viewCount: 600,
    },
    {
        id: 5,
        name: '스웨이드 스니커즈',
        price: 39000,
        category_id: 'shoes',
        imageUrl: '/products/스웨이드 스니커즈.png',
        description: '클래식한 디자인에 빈티지한 감성을 더한 브라운 스니커즈. 차분하고 깊이 있는 브라운 컬러와 부드러운 질감의 스웨이드 무드가 어우러져 자연스럽고 감각적인 스타일을 연출합니다. 화이트 슈레이스와 아이보리 컬러의 아웃솔이 조화를 이루며, 캐주얼하면서도 레트로한 분위기를 완성합니다.데님 팬츠, 와이드 팬츠, 조거 팬츠 등 다양한 하의와 자연스럽게 매치할 수 있어 데일리 스타일링에 포인트를 더하기 좋은 아이템입니다.',
        isNew: true,
        viewCount: 311,
    },
];
