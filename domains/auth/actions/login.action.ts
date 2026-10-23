'use server';

import { LoginFormValues } from '@/domains/auth/types/auth.types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

export async function login(values: LoginFormValues) {
    if (values.email === '') {
        return '이메일을 입력해 주세요.';
    }

    if (values.password === '') {
        return '비밀번호를 입력해 주세요.';
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
    });

    if (error) {
        return '이메일 또는 비밀번호가 일치하지 않습니다.';
    }

    if (!data.user) {
        return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    }

    // 헤더 인사말에 쓸 이름을 profiles에서 가져온다
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single();

    const cookieStore = await cookies();
    cookieStore.set('userName', profile?.username ?? '');

    // 로그인했으니 브라우저가 기억해 둔 예전 화면(로그아웃 상태)을 버린다
    revalidatePath('/', 'layout');

    return null;
}
