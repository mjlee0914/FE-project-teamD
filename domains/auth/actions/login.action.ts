'use server';

import { MOCK_USERS } from '@/shared/mocks/mockData';
import { LoginFormValues } from '@/domains/auth/types/auth.types';

export async function login(values: LoginFormValues) {
    if (values.loginId === '') {
        return '아이디를 입력해 주세요.';
    }

    if (values.password === '') {
        return '비밀번호를 입력해 주세요.';
    }

    const user = MOCK_USERS.find(
        (u) => u.loginId === values.loginId && u.password === values.password,
    );

    if (!user) {
        return '아이디 또는 비밀번호가 일치하지 않습니다.';
    }
    return null;
}
