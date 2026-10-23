import 'server-only';

import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { connection } from 'next/server';

// 로그인 유지 시간(초): 이 시간 동안 로그인·담기 같은 서버 동작이 없으면 쿠키가 사라져 자동 로그아웃
// (@supabase/ssr 의 cookieOptions.maxAge 는 라이브러리가 400일로 덮어써서, 아래 setAll 에서 직접 바꾼다)
const SESSION_MAX_AGE = 60 * 30; // 30분
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 가 설정되지 않았습니다.',
    );
}

// SSR supabse 연결 객체
export async function createServerClient(): Promise<SupabaseClient> {
    // cookies()만으로는 SDK 초기화의 시간·난수 사용을 프리렌더링에서
    // 제외할 수 없으므로 모든 서버 호출에 요청 시점 경계를 보장합니다.
    await connection();
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    return createSSRServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // 로그아웃처럼 지우는 쿠키(maxAge 0)는 그대로, 저장하는 쿠키는 수명을 SESSION_MAX_AGE로
                        const maxAge =
                            options?.maxAge === 0 ? 0 : SESSION_MAX_AGE;
                        cookieStore.set(name, value, { ...options, maxAge });
                    });
                } catch {
                    // 서버 컴포넌트(RSC) 렌더링 중 쿠키 쓰기 시도는 무시하고
                    // Server Actions 및 Middleware에서 쿠키 갱신을 처리합니다.
                }
            },
        },
    });
}
