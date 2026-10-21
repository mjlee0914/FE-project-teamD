'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { ReactNode } from 'react';
import type { BoardSetting, CategoryOption, Post } from '../types/board.types';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { createPostAction } from '../actions/createPost.action';
import { updatePostAction } from '../actions/updatePost.action';

interface PostFormProps {
    board: BoardSetting;
    gid: string; // 첨부파일은 글 저장 전에 올라가기 때문에 폼을 열 때 서버 내림
    post?: Post; // 수정일 때 기존 글 가져오기
    categories: CategoryOption[]; // select에 보여 줄 분류 목록 (서버 페이지에서 조회해 내림)
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

export default function PostForm({
    board,
    gid,
    post,
    categories,
}: PostFormProps) {
    const isEdit = !!post;

    const [state, formAction, isPending] = useActionState(
        isEdit ? updatePostAction : createPostAction, // 등록/수정 여부에 따라 서버함수 변경
        INITIAL_ACTION_STATE,
    );
    const errors = state.errors;
    const v = state.values; // v ?? post 순서로 사용

    // [useActionState 주의]
    // 1. action은 (prevState, formData)를 받음 — prevState를 안 써도 첫 번째 인자로 반드시 받아야 함
    // 2. React 19는 <form action> 이 끝나면 비제어 입력칸(defaultValue 쓰는 칸)을 자동으로 초기화함
    //    → 검증 에러가 날 때 사용자가 쓴 글이 지워지는 문제. 그래서 제출한 값을 values로 돌려주고
    //    각 입력칸에 defaultValue={state.values?.xxx}로 다시 채움 (실제로 유지되는지 브라우저에서 확인할 것)
    // 3. 서버 함수(createPostAction, 'use server')를 그대로 넘김. U13의 클라이언트 함수와 시그니처가 같아서 교체만 하면 됨
    //    성공하면 서버가 목록으로 redirect하므로 성공 표시는 따로 없음

    return (
        <form noValidate action={formAction}>
            <input type="hidden" name="boardId" value={board.id} />
            <input type="hidden" name="gid" value={gid} />
            {post && <input type="hidden" name="postId" value={post.id} />}

            {errors?.form && (
                <p className="mb-3 text-xs text-red-500">{errors.form}</p>
            )}

            <div className="border-t-2 border-black">
                {board.use_category && categories.length > 0 && (
                    <FormRow
                        label="분류"
                        htmlFor="category"
                        error={errors?.category}
                    >
                        <select
                            key={v?.category ?? post?.category_id ?? 'init'}
                            id="category"
                            name="category"
                            defaultValue={
                                v?.category ?? post?.category_id ?? ''
                            }
                            className="w-full border px-3 py-2 text-xs"
                        >
                            <option value="">선택하세요.</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </FormRow>
                )}

                <FormRow label="제목" htmlFor="title" error={errors?.title}>
                    <input
                        id="title"
                        name="title"
                        defaultValue={v?.title ?? post?.title}
                        placeholder="제목을 입력해 주세요."
                        className={`w-full border px-3 py-2 text-xs ${errors?.title ? 'border-red-500' : ''}`}
                    />
                </FormRow>

                <FormRow label="내용" htmlFor="content" error={errors?.content}>
                    <textarea
                        id="content"
                        name="content"
                        defaultValue={v?.content ?? post?.content}
                        placeholder="내용을 입력해 주세요."
                        className={`h-40 w-full border px-3 py-2 text-xs ${errors?.content ? 'border-red-500' : ''}`}
                    />
                </FormRow>

                {board.type === 'gallery' && (
                    <FormRow
                        label="이미지"
                        htmlFor="image"
                        error={errors?.image}
                    >
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="text-xs file:mr-3 file:cursor-pointer file:border file:border-black file:bg-white file:px-3 file:py-1.5 file:text-xs"
                        />
                        {post?.thumbnail_url && (
                            <p className="mt-1 text-xs text-gray-500">
                                현재 이미지가 있습니다. 새로 업로드하면
                                교체됩니다.
                            </p>
                        )}
                    </FormRow>
                )}

                {board.use_secret && (
                    <FormRow label="옵션">
                        <label className="flex items-center gap-2 py-1 text-xs">
                            <input
                                type="checkbox"
                                name="isSecret"
                                defaultChecked={
                                    v
                                        ? v.isSecret === 'on'
                                        : (post?.is_secret ?? false)
                                }
                            />
                            비밀글
                        </label>
                    </FormRow>
                )}
            </div>

            <div className="mt-5 flex justify-center gap-2">
                <Link
                    href={
                        post
                            ? `/boards/${board.id}/${post.id}` // 수정이면 그 글 상세로
                            : `/boards/${board.id}` // 등록이면 목록으로
                    }
                    className="w-[4.5rem] border border-black py-1.5 text-center text-xs"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-[4.5rem] cursor-pointer border border-black bg-black py-1.5 text-center text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending
                        ? isEdit
                            ? '수정 중...'
                            : '등록 중...'
                        : isEdit
                          ? '수정'
                          : '등록'}
                </button>
            </div>
        </form>
    );
}
