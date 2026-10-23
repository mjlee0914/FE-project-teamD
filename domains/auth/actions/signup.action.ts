'use server';

import { ActionState } from '@/shared/types/action.types';
import {
    normalizePhone,
    validateSignUp,
} from '@/domains/auth/utils/authValidations';
import { isPhoneTaken } from '@/domains/auth/queries/isPhoneTaken.query';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function signUpAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = ((formData.get('name') as string) ?? '').trim();
    const email = ((formData.get('email') as string) ?? '').trim();
    const password = (formData.get('password') as string) ?? '';
    const passwordConfirm = (formData.get('passwordConfirm') as string) ?? '';
    // 전화번호는 010-1234-5678 한 가지 모양으로 맞춰서 저장·비교한다
    const phone = normalizePhone((formData.get('phone') as string) ?? '');
    const address = ((formData.get('address') as string) ?? '').trim();

    const errors = validateSignUp({
        name,
        email,
        password,
        passwordConfirm,
        phone,
        address,
    });

    if (Object.keys(errors).length > 0) {
        // 비밀번호는 다시 채우지 않도록 values에서 뺀다
        return {
            success: false,
            errors,
            values: { name, email, phone, address },
        };
    }

    // 같은 전화번호로 이미 가입한 회원이 있으면 막는다 (계정을 만들기 전에 확인)
    if (await isPhoneTaken(phone)) {
        return {
            success: false,
            errors: { phone: '이미 가입된 전화번호입니다.' },
            values: { name, email, phone, address },
        };
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        return {
            success: false,
            errors: {
                email:
                    error.code === 'user_already_exists'
                        ? '이미 가입된 이메일입니다.'
                        : '회원가입에 실패했습니다. 입력한 내용을 확인해 주세요.',
            },
            values: { name, email, phone, address },
        };
    }

    // 가입 결과에 사용자 정보가 없으면 UUID를 꺼낼 수 없으므로 멈춘다
    if (!data.user) {
        return {
            success: false,
            errors: {
                form: '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            },
            values: { name, email, phone, address },
        };
    }

    // 폼 변수 이름은 name, DB 칸 이름은 username
    const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: name,
        phone,
        address,
        role: 'user',
    });

    if (profileError) {
        return {
            success: false,
            errors: {
                form: '회원 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
            },
            values: { name, email, phone, address },
        };
    }
    // 이메일 인증이 꺼져 있으면 가입과 동시에 로그인되므로, 로그아웃시킨 뒤 로그인 페이지로 보낸다
    await supabase.auth.signOut();

    //회원가입 완료 후 화면전환
    redirect('/login');
}
