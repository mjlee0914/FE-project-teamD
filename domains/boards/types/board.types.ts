// 향후 목데이터에 추가 (나중에 정리)
export type BoardWriteRole = 'all' | 'user' | 'admin';

// 게시판 구분하기 (boradId 아래에 모두 넣을 예정이기 때문)
export type BoardType = 'list' | 'faq' | 'qna' | 'gallery';

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
