'use client';

import { createBrowserClient } from '@supabase/ssr';

// 브라우저 클라이언트를 서버 조회 모듈과 분리해 서버 import 시 생성을 막습니다.
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
);
