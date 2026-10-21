import { createServerClient } from '@/lib/supabase';

// 다른 회원이 이미 쓰는 전화번호인지 확인한다.
// exceptUserId: 정보 수정 때 "내 번호"는 중복으로 치지 않으려고 넘긴다.
export async function isPhoneTaken(
    phone: string,
    exceptUserId?: string,
): Promise<boolean> {
    const supabase = createServerClient();
    const digits = phone.replace(/\D/g, '');

    // 예전에 하이픈 없이 저장된 번호도 같이 찾는다
    let query = supabase
        .from('profiles')
        .select('id')
        .in('phone', [phone, digits]);

    if (exceptUserId) {
        query = query.neq('id', exceptUserId);
    }

    const { data } = await query.limit(1);

    return (data?.length ?? 0) > 0;
}
