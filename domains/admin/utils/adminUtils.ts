import { getProfile } from '@/domains/auth/queries/getProfile.query';

export async function isAdmin() {
    const profile = await getProfile();

    return profile?.role === 'ADMIN';
}
