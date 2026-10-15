import Link from 'next/link'; // 페이지 전체를 새로고침하지 않고 필요한 부분만 바꿔서 이동

interface PaginationProps {
    basePath: string;
    page: number; // 지금 보고 있는 페이지
    totalPages: number; // 전체 페이지 수
    query?: Record<string, string | undefined>; // 쿼리가 페이지 이동 중에도 유지되도록 기록
}

// 페이지 번호 사각형 모양
const boxClass = 'min-w-7 border px-2 py-1 text-center';

// 페이지 수가 너무 많아지면 페이지 번호 줄임
function getPageItems(page: number, totalPages: number): (number | '...')[] {
    const delta = 2; // 앞뒤로 보여줄 칸 수
    const items: (number | '...')[] = [];
    let last = 0;

    for (let p = 1; p <= totalPages; p++) {
        const show =
            p === 1 ||
            p === totalPages ||
            (p >= page - delta && p <= page + delta);
        if (!show) continue;

        if (p - last > 1) {
            items.push('...');
        }
        items.push(p);
        last = p;
    }
    return items;
}

export default function Pagination({
    basePath,
    page,
    totalPages,
    query,
}: PaginationProps) {
    if (totalPages <= 1) return null; // 페이지가 하나면 아무것도 그리지 않음

    const hrefFor = (p: number) => {
        // N페이지로 이동하는 주소 만들기
        const sp = new URLSearchParams();
        // 쿼리에 들어온 조건을 하나씩 담습니다. 중복 제거하고 값이 없으면 건너뜀
        for (const [k, v] of Object.entries(query ?? {})) if (v) sp.set(k, v);
        sp.set('page', String(p));
        // "/boards/notice?q=배송&page=2" 형태로 반환
        return `${basePath}?${sp.toString()}`;
    };

    // 페이지 번호 줄임을 적용했기 때문에 번호 목록은 사용하지 않음
    // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // 화면 그리기
    return (
        <nav className="mt-6 flex justify-center gap-1 text-sm">
            {/* 1페이지보다 클 때만 < 보이기 */}
            {page > 1 && (
                <Link href={hrefFor(page - 1)} className={boxClass}>
                    &lt;
                </Link>
            )}
            {/* 페이지를 돌면서 숫자마다 링크를 생성 */}

            {getPageItems(page, totalPages).map((item, i) =>
                item === '...' ? (
                    <span
                        key={`gap-${i}`}
                        className="min-w-7 px-2 py-1 text-center text-gray-400"
                    >
                        ...
                    </span>
                ) : (
                    <Link
                        key={item} // 페이지 식별값
                        href={hrefFor(item)}
                        // aria-current="page"는 "여기가 현재 페이지"라고 알려주는 속성
                        aria-current={item === page ? 'page' : undefined} // 지금 보이는 페이지 강조
                        className={`${boxClass} ${item === page ? 'bg-black text-white' : ''}`}
                    >
                        {item}
                    </Link>
                ),
            )}
            {/* 마지막 페이지는 > 숨기기 */}
            {page < totalPages && (
                <Link href={hrefFor(page + 1)} className={boxClass}>
                    &gt;
                </Link>
            )}
        </nav>
    );
}
