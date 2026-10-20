import type { Post, BoardSetting } from '../types/board.types';
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

// 수정 권한 - 작성자 본인 또는 관리자
export function canEditPost(post: Post, user: BoardUser | null): boolean {
    if (!user) return false;
    return user.role === 'admin' || post.user_id === user.id;
}

// 열람 권한: 비밀글 아니면 누구나, 비밀글이면 작성자 본인 또는 관리자
export function canViewPost(post: Post, user: BoardUser | null): boolean {
    if (!post.is_secret) return true;
    if (!user) return false;
    return user.role === 'admin' || post.user_id === user.id;
}
