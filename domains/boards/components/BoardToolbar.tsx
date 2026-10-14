import Link from 'next/link';
import type { BoardSetting } from '../types/board.types';

interface BoardToolbarProps {
    board: BoardSetting;
    q?: string;
    category?: string;
}

export default function BoardToolbar({
    board,
    q,
    category,
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
            {board.use_category && board.categories ? (
                <div className="flex flex-wrap gap-1.5">
                    <Link href={hrefFor()} className={chipClass(!category)}>
                        전체
                    </Link>
                    {board.categories.map((c) => (
                        <Link
                            key={c}
                            href={hrefFor(c)}
                            className={chipClass(category === c)}
                        >
                            {c}
                        </Link>
                    ))}
                </div>
            ) : (
                <div />
            )}

            <form action={`/boards/${board.id}`} className="flex gap-2">
                {category && (
                    <input type="hidden" name="category" value={category} />
                )}
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="검색어를 입력하세요"
                    className="border px-3 py-1 text-sm"
                />
                <button
                    type="submit"
                    className="bg-black px-3 py-1 text-sm text-white"
                >
                    검색
                </button>
            </form>
        </div>
    );
}
