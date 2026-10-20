import { createServerClient } from '@/lib/supabase';

export async function getProfile() {
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
