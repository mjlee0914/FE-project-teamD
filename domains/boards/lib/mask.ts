import type { BoardSetting } from '../types/board.types';

// 작성자 이름 마스킹
export function maskName(name: string): string {
    const chars = [...name];
    if (chars.length <= 1) return '*';
    return chars[0] + '*'.repeat(chars.length - 1);
}

// 작성자 표시: 관리자만 쓰는 게시판(공지·이벤트·FAQ)은 작성자가 관리자라 그대로, 그 외 게시판은 이름을 가림
export function displayAuthor(
    board: Pick<BoardSetting, 'write_role'>,
    name: string,
): string {
    return board.write_role === 'admin' ? name : maskName(name);
}

// 상품 정보를 찾을 수 없을 때(삭제됐거나 DB에 없음) 대신 보여 주는 이름
export const DELETED_PRODUCT_NAME = '삭제된 상품';

// 비밀글은 제목을 가림
export const SECRET_TITLE = '🔒 비밀글입니다.';
