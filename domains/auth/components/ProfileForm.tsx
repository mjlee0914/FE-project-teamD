'use client';

import { useActionState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { updateProfileAction } from '@/domains/auth/actions/updateProfile.action';

interface ProfileFormProps {
    email: string;
    name: string;
    phone: string;
    address: string;
}

const FIELDS = [
    { name: 'name', label: '이름', type: 'text' },
    { name: 'phone', label: '전화번호', type: 'tel' },
    { name: 'address', label: '주소', type: 'text' },
] as const;

export default function ProfileForm({ email, ...initial }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <form
            action={formAction}
            noValidate
            autoComplete="off"
            className="flex max-w-sm flex-col gap-4"
        >
            {/* 이메일은 로그인 정보라 여기서 바꾸지 않는다 */}
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-lg font-medium">
                    이메일
                </label>
                <Input id="email" value={email} disabled />
            </div>

            {FIELDS.map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                    <label htmlFor={field.name} className="text-lg font-medium">
                        {field.label}
                    </label>
                    <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        // 오류가 나면 입력한 값을, 처음엔 저장된 값을 보여준다
                        defaultValue={
                            state.values?.[field.name] ?? initial[field.name]
                        }
                    />
                    {state.errors?.[field.name] && (
                        <p className="text-sm text-red-600">
                            {state.errors[field.name]}
                        </p>
                    )}
                </div>
            ))}

            {state.errors?.form && (
                <p className="text-sm text-red-600">{state.errors.form}</p>
            )}
            <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장하기'}
            </Button>
        </form>
    );
}
