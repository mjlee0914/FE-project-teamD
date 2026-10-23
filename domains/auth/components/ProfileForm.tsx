'use client';

import { useActionState } from 'react';
import { CircleCheck, Mail, CalendarDays } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { updateProfileAction } from '@/domains/auth/actions/updateProfile.action';
import { FIELD_MAX_LENGTH } from '@/domains/auth/utils/authValidations';
import { formatDate } from '@/shared/utils/formatDate';

interface ProfileFormProps {
    email: string;
    name: string;
    phone: string;
    address: string;
    role: string; // 'ADMIN' 이면 관리자 (adminUtils.ts 와 같은 값)
    createdAt: string; // 가입일 (UTC)
    saved: boolean; // 방금 저장하고 돌아왔는지
}

const FIELDS = [
    {
        name: 'name',
        label: '이름',
        type: 'text',
        maxLength: FIELD_MAX_LENGTH.name,
        placeholder: '홍길동',
        hint: '',
    },
    {
        name: 'phone',
        label: '전화번호',
        type: 'tel',
        maxLength: FIELD_MAX_LENGTH.phone,
        placeholder: '010-1234-5678',
        hint: '',
    },
    {
        name: 'address',
        label: '주소',
        type: 'text',
        maxLength: FIELD_MAX_LENGTH.address,
        placeholder: '서울특별시 구로구 ...',
        hint: '시·도부터 입력해 주세요. 예) 서울특별시 구로구 디지털로 1',
    },
] as const;

// 주문서(체크아웃)와 같은 모양: 연한 테두리 카드 + 검은 둥근 버튼
export default function ProfileForm({
    email,
    role,
    createdAt,
    saved,
    ...initial
}: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        INITIAL_ACTION_STATE,
    );

    // 가입일은 날짜만 보여준다 (formatDate 는 "YYYY-MM-DD HH:mm")
    const joinedDate = createdAt ? formatDate(createdAt).slice(0, 10) : '';

    return (
        <div className="flex flex-col gap-6">
            {/* 저장 완료 안내 (오류가 다시 나면 숨김) */}
            {saved && !state.errors && (
                <p className="flex items-center gap-2 border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <CircleCheck className="size-4" />
                    회원 정보가 저장되었습니다.
                </p>
            )}

            {/* 프로필 요약: 이름 첫 글자 동그라미 + 이메일·가입일 */}
            <section className="flex items-center gap-5 border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-black text-2xl font-black text-white">
                    {initial.name.slice(0, 1) || '?'}
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-lg font-black text-gray-900">
                            {initial.name || '이름 없음'}
                        </p>
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-gray-600 shadow-sm">
                            {role === 'ADMIN' ? '관리자' : '일반 회원'}
                        </span>
                    </div>
                    <p className="flex items-center gap-1.5 truncate text-sm text-gray-600">
                        <Mail className="size-3.5 shrink-0" />
                        {email}
                    </p>
                    {joinedDate && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {joinedDate} 가입
                        </p>
                    )}
                </div>
            </section>

            {/* 기본 정보: 이름·전화번호·주소 수정 */}
            <form
                action={formAction}
                noValidate
                autoComplete="off"
                className="flex flex-col gap-6 border border-gray-100 p-6 shadow-sm"
            >
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        기본 정보
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        주문할 때 쓰는 정보예요. 이메일은 바꿀 수 없어요.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {FIELDS.map((field) => (
                        <div key={field.name} className="flex flex-col gap-2">
                            <label
                                htmlFor={field.name}
                                className="text-sm font-bold text-gray-900"
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
                                className="h-11"
                                // 오류가 나면 입력한 값을, 처음엔 저장된 값을 보여준다
                                defaultValue={
                                    state.values?.[field.name] ??
                                    initial[field.name]
                                }
                            />
                            {state.errors?.[field.name] ? (
                                <p className="text-xs text-red-600">
                                    {state.errors[field.name]}
                                </p>
                            ) : (
                                field.hint && (
                                    <p className="text-xs text-gray-400">
                                        {field.hint}
                                    </p>
                                )
                            )}
                        </div>
                    ))}
                </div>

                {state.errors?.form && (
                    <p className="text-sm text-red-600">{state.errors.form}</p>
                )}

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full rounded-2xl bg-black font-bold text-white hover:bg-zinc-700"
                >
                    {isPending ? '저장 중...' : '저장하기'}
                </Button>
            </form>
        </div>
    );
}
