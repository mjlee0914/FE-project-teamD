'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { ReactNode } from 'react';
import type { BoardSetting } from '../types/board.types';
import {
    INITIAL_ACTION_STATE,
    type ActionState,
} from '@/shared/types/action.types';
import { validatePost } from '../lib/validatePost';

interface PostFromProps {
    board: BoardSetting;
    gid: string; // 첨부파일은 글 저장 전에 올라가기 때문에 폼을 열 때 서버 내림
}

function FormRow({
    label,
    htmlFor,
    error,
    children,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-[110px_1fr] border-b">
            <label
                htmlFor={htmlFor}
                className="bg-stone-50 px-3 py-3.5 text-xs font-bold"
            >
                {label}
            </label>
            <div className="px-3 py-2.5">
                {children}
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        </div>
    );
}

export default function PostForm({ board, gid }: PostFromProps) {
    // [useActionState 주의]
    // 1. action은 (prevState, formData)를 받음 — prevState를 안 써도 첫 번째 인자로 반드시 받아야 함
    // 2. React 19는 <form action> 이 끝나면 비제어 입력칸(defaultValue 쓰는 칸)을 자동으로 초기화함
    //    → 검증 에러가 날 때 사용자가 쓴 글이 지워지는 문제. 그래서 제출한 값을 values로 돌려주고
    //    각 입력칸에 defaultValue={state.values?.xxx}로 다시 채움 (실제로 유지되는지 브라우저에서 확인할 것)
    // 3. 지금은 클라이언트 함수. 나중에 'use server' Server Action으로 교체 (같은 시그니처 유지)

    async function postAction(
        _prevState: ActionState,
        formData: FormData,
    ): Promise<ActionState> {
        // 에러가 나도 입력칸을 다시 채울 수 있게 제출값을 모아둠
        const values = {
            category: String(formData.get('category') ?? ''),
            title: String(formData.get('title') ?? ''),
            content: String(formData.get('content') ?? ''),
            isSecret: formData.get('isSecret') ? 'on' : '',
        };

        const errors = validatePost(board, formData);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors, values };
        }

        // 검증을 통과하면
        return { success: true, values };
    }

    const [state, formAction, isPending] = useActionState(
        postAction,
        INITIAL_ACTION_STATE,
    );
    const errors = state.errors;

    return (
        <form noValidate action={formAction}>
            <input type="hidden" name="boardId" value={board.id} />
            <input type="hidden" name="gid" value={gid} />

            <div className="border-t-2 border-black">
                {board.use_category && board.categories && (
                    <FormRow
                        label="분류"
                        htmlFor="category"
                        error={errors?.category}
                    >
                        <select
                            id="category"
                            name="category"
                            defaultValue=""
                            className="w-full border px-3 py-2 text-xs"
                        >
                            <option value="">선택하세요.</option>
                            {board.categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </FormRow>
                )}

                <FormRow label="제목" htmlFor="title" error={errors?.title}>
                    <input
                        id="title"
                        name="title"
                        defaultValue={state.values?.title}
                        placeholder="제목을 입력해 주세요."
                        className={`w-full border px-3 py-2 text-xs ${errors?.title ? 'border-red-500' : ''}`}
                    />
                </FormRow>

                <FormRow label="내용" htmlFor="content">
                    <textarea
                        id="content"
                        name="content"
                        defaultValue={state.values?.content}
                        placeholder="내용을 입력해 주세요."
                        className={`h-40 w-full border px-3 py-2 text-xs ${errors?.content ? 'border-red-500' : ''}`}
                    />
                </FormRow>

                {/* 첨부파일 구역은 나중에 추가 */}

                {board.use_secret && (
                    <FormRow label="옵션">
                        <label className="item-center flex gap-2 text-xs">
                            <input
                                type="checkbox"
                                name="isSecret"
                                defaultChecked={state.values?.isSecret === 'on'}
                            />
                            비밀글
                        </label>
                    </FormRow>
                )}
            </div>

            {/* 임시검증통과표시 */}
            {state.success && (
                <p className="mt-3 text-center text-xs text-gray-500">
                    검증을 통과했습니다.
                </p>
            )}

            <div className="mt-5 flex justify-center gap-2">
                <Link
                    href={`/boards/${board.id}`}
                    className="w-[4.5rem] border border-black py-1.5 text-center text-xs"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    className="w-[4.5rem] border border-black bg-black py-1.5 text-center text-xs text-white"
                >
                    {isPending ? '등록 중...' : '등록'}
                </button>
            </div>
        </form>
    );
}
