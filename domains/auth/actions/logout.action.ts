'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    const cookieStore = await cookies();
    cookieStore.delete('userName');
    redirect('/login');
}
