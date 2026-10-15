'use client';

// 삭제 확인창은 별도 라이브러리 없이 HTML 기본 다이얼로그 사용

import { useActionState } from 'react';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { deletePostAction } from '../actions/deletePost.action';
import { useRef } from 'react';

interface DeleteButtonProps {
    boardId: string;
    postId: string;
}

export default function DeleteButton({ boardId, postId }: DeleteButtonProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [state, formAction, isPending] = useActionState(
        deletePostAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <>
            <button
                type="button"
                onClick={() => dialogRef.current?.showModal()}
                className="w-[4.5rem] cursor-pointer border border-red-500 py-1.5 text-center text-xs text-red-500"
            >
                삭제
            </button>

            <dialog
                ref={dialogRef}
                className="m-auto w-80 border p-5 text-center text-sm backdrop:bg-black/40"
            >
                <p className="font-bold">정말 삭제할까요?</p>
                <p className="mt-1 text-xs text-gray-500">
                    삭제한 글은 복구할 수 없습니다.
                </p>

                {state.errors?.form && (
                    <p className="mt-2 text-xs text-red-500">
                        {state.errors.form}
                    </p>
                )}

                <form
                    action={formAction}
                    className="mt-4 flex justify-center gap-2"
                >
                    <input type="hidden" name="boardId" value={boardId} />
                    <input type="hidden" name="postId" value={postId} />
                    <button type="submit" disabled={isPending}></button>
                </form>
            </dialog>
        </>
    );
}
