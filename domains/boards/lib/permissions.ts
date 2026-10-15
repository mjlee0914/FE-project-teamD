import type { BoardSetting } from '../types/board.types';
import type { BoardUser } from './currentUser';

// 게시글 등록 권한
// - 'all'  : 누구나 (비로그인 포함)
// - 'user' : 로그인한 사용자 (관리자 포함)
// - 'admin': 관리자만
export function canWriteBoard(
    board: BoardSetting,
    user: BoardUser | null,
): boolean {
    switch (board.write_role) {
        case 'all':
            return true;
        case 'user':
            return user !== null;
        case 'admin':
            return user?.role === 'admin';
    }
}
