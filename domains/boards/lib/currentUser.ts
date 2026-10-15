// 현재 로그인한 사용자 (mock)
// 팀 로그인(login.action.ts)은 쿠키에 이름만 저장하고 User에 role이 없어서,
// 게시판 쪽에서는 이 파일 하나로 격리해 둠 → 실제 인증이 붙으면 이 파일만 교체

export type UserRole = 'user' | 'admin';

export interface BoardUser {
    id: string; // 내 글 여부 확인
    name: string;
    role: UserRole;
}

// 유저 상태
const MOCK_LOGIN_AS: 'guest' | UserRole = 'user';

const MOCK_BOARD_USERS: Record<UserRole, BoardUser> = {
    user: { id: 'user-1', name: '김현욱', role: 'user' },
    admin: { id: 'admin', name: '관리자', role: 'admin' },
};

export async function getCurrentUser(): Promise<BoardUser | null> {
    if (MOCK_LOGIN_AS === 'guest') return null;
    return MOCK_BOARD_USERS[MOCK_LOGIN_AS];
}
