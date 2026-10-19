'use server';

import { ActionState } from '@/shared/types/action.types';
import { validateSignUp } from '@/domains/auth/utils/authValidations';

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

    // TODO: Supabase Auth 가입 + profiles 저장 (D단계)

    return {
        success: true,
        data: {},
    };
}
