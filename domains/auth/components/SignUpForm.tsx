'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { signUpAction } from '@/domains/auth/actions/signup.action';
import { FIELD_MAX_LENGTH } from '@/domains/auth/utils/authValidations';

const FIELDS = [
    {
        name: 'email',
        label: '이메일',
        type: 'email',
        maxLength: FIELD_MAX_LENGTH.email,
        placeholder: 'example@email.com',
    },
    {
        name: 'name',
        label: '이름',
        type: 'text',
        maxLength: FIELD_MAX_LENGTH.name,
        placeholder: '홍길동',
    },
    {
        name: 'password',
        label: '비밀번호',
        type: 'password',
        maxLength: FIELD_MAX_LENGTH.password,
        placeholder: '8자 이상',
    },
    {
        name: 'passwordConfirm',
        label: '비밀번호 확인',
        type: 'password',
        maxLength: FIELD_MAX_LENGTH.password,
        placeholder: '',
    },
    {
        name: 'phone',
        label: '전화번호',
        type: 'tel',
        maxLength: FIELD_MAX_LENGTH.phone,
        placeholder: '010-1234-5678',
    },
    {
        name: 'address',
        label: '주소',
        type: 'text',
        maxLength: FIELD_MAX_LENGTH.address,
        placeholder: '서울특별시 구로구 ...',
    },
];

export default function SignUpForm() {
    const [state, formAction, isPending] = useActionState(
        signUpAction,
        INITIAL_ACTION_STATE,
    );

    // 주문서(체크아웃)와 같은 모양: 굵은 제목 + 테두리 카드 + 검은 둥근 버튼
    return (
        <div className="mx-auto max-w-md px-4 py-12 md:py-16">
            <h3 className="text-2xl font-black text-gray-900">회원가입</h3>
            <p className="mt-1 mb-6 text-sm text-gray-500">
                정보를 입력하고 DN MALL 회원이 되어 보세요.
            </p>

            <form
                action={formAction}
                noValidate
                autoComplete="off"
                className="flex flex-col gap-6 rounded-xs border p-6"
            >
                {FIELDS.map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-bold"
                        >
                            {field.label}
                        </label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            maxLength={field.maxLength}
                            placeholder={field.placeholder}
                            aria-invalid={!!state.errors?.[field.name]}
                            // 오류가 나도 입력한 값이 지워지지 않게 서버가 돌려준 값을 다시 채운다
                            defaultValue={
                                field.type === 'password'
                                    ? ''
                                    : state.values?.[field.name]
                            }
                        />
                        {state.errors?.[field.name] && (
                            <p className="text-xs text-red-600">
                                {state.errors[field.name]}
                            </p>
                        )}
                    </div>
                ))}

                {state.errors?.form && (
                    <p className="text-xs text-red-600">{state.errors.form}</p>
                )}

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full rounded-2xl bg-black font-bold text-white hover:bg-zinc-700"
                >
                    {isPending ? '처리 중...' : '가입하기'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                이미 회원이신가요?{' '}
                <Link
                    href="/login"
                    className="font-bold text-gray-900 underline"
                >
                    로그인
                </Link>
            </p>
        </div>
    );
}
