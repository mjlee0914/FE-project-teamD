import { cookies } from 'next/headers';
import { MOCK_USERS } from '@/shared/mocks/mockData';

// 현재 로그인한 사용자 (mock)
// 팀 로그인(login.action.ts)은 쿠키 'userName'에 이름만 저장하고 User에 role이 없어서,
// 게시판 쪽에서는 이 파일 하나로 격리해 둠 → 실제 인증이 붙으면 이 함수 안쪽만 교체
// (함수 이름과 반환 모양 BoardUser | null 은 유지 → 호출하는 곳은 고칠 필요 없음)

export type UserRole = 'user' | 'admin';

export interface BoardUser {
    id: string; // 내 글 여부 확인 (mock 글의 user_id와 같은 UUID여야 "본인" 판정이 맞음)
    name: string;
    role: UserRole;
}

// 쿠키 값(이름)에서 만들어 줄 사용자 틀
const MOCK_BOARD_USERS: Record<UserRole, BoardUser> = {
    // id는 mock 글(POSTS)의 user_id 시드 UUID와 맞춤: 관리자 …0001, 일반 사용자 …0002
    user: {
        id: '10000000-0000-4000-8000-000000000002',
        name: '일반 사용자',
        role: 'user',
    },
    admin: {
        id: '10000000-0000-4000-8000-000000000001',
        name: '관리자',
        role: 'admin',
    },
};

export async function getCurrentUser(): Promise<BoardUser | null> {
    // 쿠키는 요청 시점 값이라 <Suspense> 안에서만 읽을 수 있음
    // ([boardId]/loading.tsx가 게시판 아래 페이지를 이미 감싸 줌)
    const cookieStore = await cookies();
    const userName = cookieStore.get('userName')?.value;

    // 쿠키가 없으면 비로그인
    if (!userName) return null;

    // [임시] 로그인한 이름으로 MOCK_USERS에서 계정을 찾고, loginId가 'admin'이면 관리자로 취급
    // → 인증 담당자가 role을 제대로 넣으면 이 부분을 교체 (일지의 "인증 담당자와 확인" 항목)
    const account = MOCK_USERS.find((u) => u.name === userName);
    if (account?.loginId === 'admin') return MOCK_BOARD_USERS.admin;

    // 그 외 로그인한 사용자는 일반 사용자 (이름은 쿠키 값 그대로)
    return { ...MOCK_BOARD_USERS.user, name: userName };
}
