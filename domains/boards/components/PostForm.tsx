'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { BoardSetting } from '../types/board.types';

interface PostFromProps {
    board: BoardSetting;
    gid: string; // 첨부파일은 글 저장 전에 올라가기 때문에 폼을 열 때 서버 내림
}

function FormRow({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid-col-cols-[110px_1fr] boarder-b grid">
            <label
                htmlFor={htmlFor}
                className="bg-stone-50 px-3 py-3.5 text-xs font-bold"
            >
                {label}
            </label>
            <div className="px-3 py-2.5">{children}</div>
        </div>
    );
}

// 입력 UI (제출은 아직 불가)
export default function PostForm({ board, gid }: PostFromProps) {
    return (
        // 검증 문구와 임시 제출 구현
        <form noValidate onSubmit={(e) => e.preventDefault()}>
            <input type="hidden" name="boardId" value={board.id} />
            <input type="hidden" name="gid" value={gid} />

            <div className="border-t-2 border-black">
                {board.use_category && board.categories && (
                    <FormRow label="분류" htmlFor="category">
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

                <FormRow label="제목" htmlFor="title">
                    <input
                        id="title"
                        name="title"
                        placeholder="제목을 입력해 주세요."
                        className="w-full border px-3 py-2 text-xs"
                    />
                </FormRow>

                <FormRow label="내용" htmlFor="content">
                    <textarea
                        id="content"
                        name="content"
                        placeholder="내용을 입력해 주세요."
                        className="h-40 w-full border px-3 py-2 text-xs"
                    />
                </FormRow>

                {/* 첨부파일 구역은 나중에 추가 */}

                {board.use_secret && (
                    <FormRow label="옵션">
                        <label className="item-center flex gap-2 text-xs">
                            <input type="checkbox" name="isSecret" />
                            비밀글
                        </label>
                    </FormRow>
                )}
            </div>

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
                    등록
                </button>
            </div>
        </form>
    );
}
