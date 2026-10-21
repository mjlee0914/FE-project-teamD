import type { BoardCategoryRow } from '../types/board.types';

// 게시판 분류 mock: 실제 DB `category` 표(10/21, 관리자 화면으로 입력한 19행)에 맞춤
// - 루트(depth 0, parent_id ''): 게시판마다 1개 → boards.category_id가 가리킴
// - 칩(depth 1): 루트의 자식 = 목록 위 칩 / 글의 분류
// 실제 DB의 id는 UUID라 아래 'cat-...' 문자열과 다름 → 코드는 id를 박지 않고 구조(parent_id)와 이름으로 찾음
// (게시판 분류가 상품 분류에 섞이지 않도록 type은 항상 'BOARD')
const boardCat = (
    id: string,
    parent_id: string,
    name: string,
    depth: number,
    sort_order: number,
): BoardCategoryRow => ({
    id,
    parent_id,
    name,
    depth,
    sort_order,
    type: 'BOARD',
    created_at: '2026-10-13T00:00:00Z', // 고정 시각(mock)
    deleted_at: null,
});

export const BOARD_CATEGORY_ROWS: BoardCategoryRow[] = [
    // 루트: 게시판마다 1개 (DB 입력 순서 = sort_order)
    boardCat('cat-board-notice', '', '공지사항', 0, 1),
    boardCat('cat-board-qna', '', 'Q&A', 0, 2),
    boardCat('cat-board-events', '', '이벤트', 0, 3),
    boardCat('cat-board-faq', '', 'FAQ', 0, 4),
    boardCat('cat-board-review', '', '상품리뷰', 0, 5),
    boardCat('cat-board-free', '', '자유게시판', 0, 6),
    boardCat('cat-board-lookbook', '', '룩북게시판', 0, 7),
    // 칩: review, free, lookbook은 분류 없음
    boardCat('cat-notice-info', 'cat-board-notice', '공지', 1, 1),
    boardCat('cat-notice-delivery', 'cat-board-notice', '배송', 1, 2),
    boardCat('cat-events-ongoing', 'cat-board-events', '진행중', 1, 1),
    boardCat('cat-events-ended', 'cat-board-events', '종료', 1, 2),
    boardCat('cat-faq-delivery', 'cat-board-faq', '배송', 1, 1),
    boardCat('cat-faq-order', 'cat-board-faq', '주문/결제', 1, 2),
    boardCat('cat-faq-exchange', 'cat-board-faq', '교환/반품', 1, 3),
    boardCat('cat-faq-etc', 'cat-board-faq', '기타', 1, 4),
    boardCat('cat-qna-product', 'cat-board-qna', '상품', 1, 1),
    boardCat('cat-qna-etc', 'cat-board-qna', '기타', 1, 2),
    boardCat('cat-qna-delivery', 'cat-board-qna', '배송', 1, 3),
    boardCat('cat-qna-exchange', 'cat-board-qna', '교환/반품', 1, 4),
];
