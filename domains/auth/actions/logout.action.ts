'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    const cookieStore = await cookies();
    cookieStore.delete('userName');
    // 로그아웃했으니 기억해 둔 예전 화면(로그인 상태)을 버린다
    revalidatePath('/', 'layout');
    redirect('/login');
}
