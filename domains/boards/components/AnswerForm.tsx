'use client';

import { useActionState } from 'react';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { answerPostAction } from '../actions/answerPost.action';

interface AnswerFormProps {
    boardId: string;
    postId: string;
    current?: string; // 이미 답변이 있으면 수정 모드
}

export default function AnswerForm({
    boardId,
    postId,
    current,
}: AnswerFormProps) {
    const [state, formAction, isPending] = useActionState(
        answerPostAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <form action={formAction} className="border-b px-4 py-5">
            <input type="hidden" name="boardId" value={boardId} />
            <input type="hidden" name="postId" value={postId} />
            <div className="flex gap-2">
                <textarea
                    name="content"
                    rows={5}
                    defaultValue={state.values?.content ?? current ?? ''}
                    className="min-w-0 flex-1 resize-none border p-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-24 cursor-pointer border bg-stone-50 text-xs disabled:opacity-50"
                >
                    {isPending
                        ? '저장 중'
                        : current
                          ? '답변 수정'
                          : '답변 등록'}
                </button>
            </div>
            {/* 에러 문구는 이 박스 아래에 */}
            {state.errors?.content && (
                <p className="mt-1 text-xs text-red-500">
                    {state.errors.content}
                </p>
            )}
            {state.errors?.form && (
                <p className="mt-1 text-xs text-red-500">{state.errors.form}</p>
            )}
        </form>
    );
}
