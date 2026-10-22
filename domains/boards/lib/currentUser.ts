import { getProfile } from '@/domains/auth/queries/getProfile.query';
import { cookies } from 'next/headers';
import { MOCK_USERS } from '../mocks/users';

// 현재 로그인한 사용자 (supabase 인증 연동)

export type UserRole = 'user' | 'admin';

export interface BoardUser {
    id: string; // profiles.id (UUID) → posts.user_id, 본인 글 판정, 구매 확인에 사용
    name: string;
    role: UserRole;
}

export async function getCurrentUser(): Promise<BoardUser | null> {
    const profile = await getProfile();

    // 세션이 없거나 profiles 행이 없으면 비로그인
    if (!profile) return null;

    return {
        id: profile.id,
        name: profile.username ?? profile.email ?? '회원',
        // DB에는 ADMIN, 게시판 내에서는 admin으로 사용 (여기서 변환)
        role: profile.role === 'ADMIN' ? 'admin' : 'user',
    };
}
