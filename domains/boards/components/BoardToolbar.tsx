import Link from 'next/link';
import Form from 'next/form';
import type { BoardSetting, CategoryOption } from '../types/board.types';

interface BoardToolbarProps {
    board: BoardSetting;
    q?: string;
    category?: string; // 선택된 분류 id
    categories: CategoryOption[]; // 칩으로 보여 줄 분류 목록
    canWrite?: boolean; // 쓰기 권한이 있을 때만 글쓰기 버튼을 보여 줌 (권한 판단은 page.tsx에서)
}

export default function BoardToolbar({
    board,
    q,
    category,
    categories,
    canWrite,
}: BoardToolbarProps) {
    const hrefFor = (c?: string) => {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q);
        if (c) sp.set('category', c);
        const qs = sp.toString();
        return qs ? `/boards/${board.id}?${qs}` : `/boards/${board.id}`;
    };

    const chipClass = (active: boolean) =>
        `rounded-full border px-3 py-1 text-xs ${active ? 'bg-black text-white' : ''}`;

    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {board.use_category && categories.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                    <Link href={hrefFor()} className={chipClass(!category)}>
                        전체
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c.id}
                            href={hrefFor(c.id)}
                            className={chipClass(category === c.id)}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            ) : (
                <div />
            )}

            {/* 오른쪽: [검색창] [검색] [글쓰기] 한 줄 */}
            <div className="flex items-center gap-2">
                <Form
                    action={`/boards/${board.id}`} // 제출하면 ?q=검색어가 붙음
                    scroll={false} // 검색 후 맨 위로 스크롤하지 않음
                    className="flex gap-2"
                >
                    {category && (
                        <input type="hidden" name="category" value={category} />
                    )}
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="검색어를 입력하세요"
                        className="border px-3 py-1.5 text-xs"
                    />
                    <button
                        type="submit"
                        className="w-[4.5rem] cursor-pointer border border-black bg-black py-1.5 text-center text-xs text-white"
                    >
                        검색
                    </button>
                </Form>

                {canWrite && (
                    <Link
                        href={`/boards/${board.id}/new`}
                        className="w-[4.5rem] border border-black bg-white py-1.5 text-center text-xs text-black"
                    >
                        글쓰기
                    </Link>
                )}
            </div>
        </div>
    );
}
