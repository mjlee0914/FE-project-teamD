'use server';

import { ActionState } from '@/shared/types/action.types';
import { validateSignUp } from '@/domains/auth/utils/authValidations';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function signUpAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = (formData.get('name') as string) ?? '';
    const email = (formData.get('email') as string) ?? '';
    const password = (formData.get('password') as string) ?? '';
    const passwordConfirm = (formData.get('passwordConfirm') as string) ?? '';
    const phone = (formData.get('phone') as string) ?? '';
    const address = (formData.get('address') as string) ?? '';

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

    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        return {
            success: false,
            errors: { email: error.message },
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
