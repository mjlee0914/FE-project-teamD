import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function getProfile() {
    // 로그인 정보는 요청마다 달라서 미리 만들어 둘 수 없다고 Next.js에 알린다
    await connection();

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (errorProfile) {
        console.error('Error fetching profile:', errorProfile);
        return null;
    }
    return profile;
}
