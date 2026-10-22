'use client';

import { useActionState } from 'react';
import { CircleCheck } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { updateProfileAction } from '@/domains/auth/actions/updateProfile.action';
import { FIELD_MAX_LENGTH } from '@/domains/auth/utils/authValidations';

interface ProfileFormProps {
    email: string;
    name: string;
    phone: string;
    address: string;
    saved: boolean; // 방금 저장하고 돌아왔는지
}

const FIELDS = [
    {
        name: 'name',
        label: '이름',
        type: 'text',
        maxLength: FIELD_MAX_LENGTH.name,
        placeholder: '홍길동',
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
] as const;

// 체크아웃 배송지 카드와 같은 모양: 왼쪽 라벨 / 오른쪽 입력칸
export default function ProfileForm({
    email,
    saved,
    ...initial
}: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <div className="flex flex-col gap-6">
            {/* 저장 완료 안내 (오류가 다시 나면 숨김) */}
            {saved && !state.errors && (
                <p className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <CircleCheck className="size-4" />
                    회원 정보가 저장되었습니다.
                </p>
            )}

            {/* 로그인 정보: 이메일은 바꿀 수 없어서 글자로만 보여준다 */}
            <section className="flex flex-col gap-6 border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">로그인 정보</h2>
                <div className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]">
                    <span className="text-md font-bold md:justify-self-end">
                        이메일
                    </span>
                    <p className="text-sm text-gray-700">
                        {email}
                        <span className="ml-2 text-xs text-gray-400">
                            (변경 불가)
                        </span>
                    </p>
                </div>
            </section>

            {/* 기본 정보: 이름·전화번호·주소 수정 */}
            <form
                action={formAction}
                noValidate
                autoComplete="off"
                className="flex flex-col gap-6 border border-gray-100 p-6 shadow-sm"
            >
                <h2 className="text-lg font-bold text-gray-900">기본 정보</h2>

                <div className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]">
                    {FIELDS.map((field) => (
                        <div key={field.name} className="contents">
                            <label
                                htmlFor={field.name}
                                className="text-md font-bold md:justify-self-end"
                            >
                                {field.label}
                            </label>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    aria-invalid={!!state.errors?.[field.name]}
                                    // 오류가 나면 입력한 값을, 처음엔 저장된 값을 보여준다
                                    defaultValue={
                                        state.values?.[field.name] ??
                                        initial[field.name]
                                    }
                                />
                                {state.errors?.[field.name] && (
                                    <p className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-600">
                                        {state.errors[field.name]}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {state.errors?.form && (
                    <p className="text-sm text-red-600">{state.errors.form}</p>
                )}

                <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 h-12 w-full rounded-2xl bg-black font-bold text-white hover:bg-zinc-700"
                >
                    {isPending ? '저장 중...' : '저장하기'}
                </Button>
            </form>
        </div>
    );
}
