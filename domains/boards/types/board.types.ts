// 향후 목데이터에 추가 (나중에 정리)
export type BoardWriteRole = 'all' | 'user' | 'admin';

// 게시판 구분하기 (boradId 아래에 모두 넣을 예정이기 때문)
export type BoardType = 'list' | 'faq' | 'qna' | 'gallery';

// 게시판과 상품의 연결 방식
// none: 상품과 무관 / optional: 상품에서 쓴 글과 일반 글이 섞임(qna) / required: 반드시 상품에 속함(review)
export type BoardProductScope = 'none' | 'optional' | 'required';

// 게시판 인터페이스(규격)
export interface BoardSetting {
    id: string; // notice, qna, review 등
    eyebrow: string;
    name: string;
    description: string;
    type: BoardType;
    write_role: BoardWriteRole;
    use_secret?: boolean; // qna 비밀글 허용 여부
    use_attachment?: boolean; // 파일 첨부 허용 여부
    use_category?: boolean; // 게시물 카테고리 (게시판 안의 세부 카테고리)
    categories?: string[]; // user_category를 담을 배열
    // 상품 연동 (review, qna). 없으면 'none'으로 취급
    // 주의: boards 테이블에는 컬럼을 추가하지 않고 코드 설정표(BOARD_CONFIG)로 관리
    product_scope?: BoardProductScope;
    use_rating?: boolean; // 별점 사용 (review) → Post.rating
    created_at: string;
}

// 게시물 인터페이스(규격에 대입될 값)
// Supabase posts 테이블 컬럼명에 맞춤 (전환 시 매핑 최소화)
export interface Post {
    id: string; // DB: UUID (mock은 'post-1' 형태)
    board_id: string;
    category?: string; // use_category가 있는 경우만
    title: string;
    content: string;
    user_id: string | null; // DB: profiles.id (탈퇴 시 null)
    author_name: string;
    gid: string; // file_info.gid (첨부/본문 이미지 묶음)
    view_count: number;
    is_pinned?: boolean; // 공지 고정 여부
    is_secret?: boolean; // qna 비밀글 여부
    thumbnail_url?: string; // 룩북 섬네일
    // 상품 연동 (DB: posts.product_id UUID NULL → products.id, 내 posts에서 공유 테이블로 향하는 FK이고 products는 수정하지 않음)
    // - 일반 Q&A: board_id='qna', product_id 없음 / 상품 Q&A: board_id='qna', product_id 있음 (post_type 컬럼 불필요)
    // - review는 product_id 필수
    // - mock의 products.id는 숫자(1,2..)라서 문자열로 바꿔('1') 저장. DB 전환 시 UUID로 교체
    product_id?: string | null;
    // 별점 1~5 (DB: posts.rating SMALLINT). use_rating 게시판(review)만 사용
    rating?: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null; // 소프트 삭제: null인 글만 노출
    answer?: QnaAnswer; // 답변완료(QnaAnswer 연결) 또는 답변대기
}

// 게시물 인터페이스 - QnA
export interface QnaAnswer {
    content: string;
    answered_by: string;
    answered_at: string;
}

// 게시물 인터페이스 - FaQ
// 향후 Supabase faqs 테이블로 생성 예정 (posts와 같은 규칙: UUID, 소프트 삭제)
export interface FaqItem {
    id: string; // DB: UUID (mock은 'faq-1' 형태)
    category: string;
    question: string;
    answer: string;
    sort_order: number; // 게시물 수동 정렬
    created_at: string;
    updated_at: string;
    deleted_at: string | null; // 소프트 삭제: null인 항목만 노출
}
