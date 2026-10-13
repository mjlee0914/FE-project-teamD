export type BoardWriteRole = 'all' | 'user' | 'admin';

// 게시판 구분하기 (boradId 아래에 모두 넣을 예정이기 때문)
export type BoardType = 'list' | 'faq' | 'qna' | 'gallery';

// 게시판 인터페이스(규격)
export interface BoardSetting {
    id: string; // notice, qna, review 등
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
export interface Post {
    id: number;
    board_id: string;
    category?: string; // use_category가 있는 경우만
    title: string;
    content: string;
    author_id: string;
    author_name: string;
    gid: string; // file_info.gid (첨부/본문 이미지 묶음)
    view_count: number;
    is_pinned?: boolean; // 공지 고정 여부
    is_secret?: boolean; // qna 비밀글 여부
    thumbnail_url?: string; // 룩북 섬네일
    created_at: string;
    answer?: QnaAnswer; // 답변완료(QnaAnswer 연결) 또는 답변대기
}

// 게시물 인터페이스 - QnA
export interface QnaAnswer {
    contents: string;
    answered_by: string;
    answered_at: string;
}

// 게시물 인터페이스 - FaQ
export interface FaqItem {
    id: number;
    category: string;
    question: string;
    answer: string;
    sort_order: number; // 게시물 수동 정렬
}
