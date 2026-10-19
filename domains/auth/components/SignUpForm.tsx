'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { signUpAction } from '@/domains/auth/actions/signup.action';

const FIELDS = [
    { name: 'email', label: '이메일', type: 'email' },
    { name: 'name', label: '이름', type: 'text' },
    { name: 'password', label: '비밀번호', type: 'password' },
    { name: 'passwordConfirm', label: '비밀번호 확인', type: 'password' },
    { name: 'phone', label: '전화번호', type: 'tel' },
    { name: 'address', label: '주소', type: 'text' },
];

export default function SignUpForm() {
    const [state, formAction, isPending] = useActionState(
        signUpAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <form
            action={formAction}
            noValidate
            autoComplete="off"
            className="mx-auto flex max-w-sm flex-col gap-2 py-16"
        >
            {FIELDS.map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                    <label htmlFor={field.name}>{field.label}</label>
                    <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        // 오류가 나도 입력한 값이 지워지지 않게 서버가 돌려준 값을 다시 채운다
                        defaultValue={
                            field.type === 'password'
                                ? ''
                                : state.values?.[field.name]
                        }
                    />
                    {state.errors?.[field.name] && (
                        <p className="text-sm text-red-600">
                            {state.errors[field.name]}
                        </p>
                    )}
                </div>
            ))}
            <Button type="submit" disabled={isPending}>
                {isPending ? '처리 중...' : '가입하기'}
            </Button>
            <p className="text-center text-sm text-gray-500">
                이미 회원이신가요?{' '}
                <Link href="/login" className="underline">
                    로그인
                </Link>
            </p>
        </form>
    );
}
