'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ActionState } from '@/shared/types/action.types';
import {
    normalizePhone,
    validateAddress,
    validateName,
    validatePhone,
} from '@/domains/auth/utils/authValidations';
import { isPhoneTaken } from '@/domains/auth/queries/isPhoneTaken.query';
import { createServerClient } from '@/lib/supabase';

export async function updateProfileAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = ((formData.get('name') as string) ?? '').trim();
    const phone = normalizePhone((formData.get('phone') as string) ?? '');
    const address = ((formData.get('address') as string) ?? '').trim();
    const values = { name, phone, address };

    // 칸마다 검사해서 오류가 있는 칸만 모은다
    const errors: Record<string, string> = {};
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const addressError = validateAddress(address);
    if (nameError) errors.name = nameError;
    if (phoneError) errors.phone = phoneError;
    if (addressError) errors.address = addressError;

    if (Object.keys(errors).length > 0) {
        return { success: false, errors, values };
    }

    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            errors: { form: '로그인이 필요합니다.' },
            values,
        };
    }

    // 내 번호는 빼고, 다른 회원이 쓰는 번호면 막는다
    if (await isPhoneTaken(phone, user.id)) {
        return {
            success: false,
            errors: { phone: '이미 가입된 전화번호입니다.' },
            values,
        };
    }

    // .eq('id', user.id)가 없으면 모든 회원 정보가 바뀌므로 꼭 내 줄만 바꾼다
    const { error } = await supabase
        .from('profiles')
        .update({ username: name, phone, address })
        .eq('id', user.id);

    if (error) {
        return {
            success: false,
            errors: {
                form: '회원 정보를 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.',
            },
            values,
        };
    }

    // 헤더 인사말에 쓰는 이름 쿠키도 새 이름으로 바꾼다
    const cookieStore = await cookies();
    cookieStore.set('userName', name);

    redirect('/mypage?saved=1');
}
