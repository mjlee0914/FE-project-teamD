import type { User } from '@/domains/auth/types/auth.types';

// 로그인 테스트용 회원 mock (게시판의 임시 관리자 판정 전용)
// domains/boards/lib/currentUser.ts가 쿠키의 이름으로 이 목록에서 계정을 찾고, loginId가 'admin'이면 관리자로 취급
// 인증이 실제 role을 붙이면(getCurrentUser 교체) 이 파일은 삭제
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
