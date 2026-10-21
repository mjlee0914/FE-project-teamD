import Link from 'next/link';

interface PhotoFilterProps {
    basePath: string;
    photo?: string; // 1|0|string
    query?: Record<string, string | undefined>; // 유지할 쿼리
}

const OPTIONS = [
    { value: undefined, label: '전체' },
    { value: '1', label: '포토 리뷰' },
    { value: '0', label: '일반 리뷰' },
];

export default function PhotoFilter({
    basePath,
    photo,
    query,
}: PhotoFilterProps) {
    const hrefFor = (value?: string) => {
        const sp = new URLSearchParams();
        for (const [k, v] of Object.entries(query ?? {})) if (v) sp.set(k, v);
        if (value) sp.set('photo', value);
        const qs = sp.toString();
        return qs ? `${basePath}?${qs}` : basePath;
    };
    return (
        <div className="mb-3 flex gap-1.5">
            {OPTIONS.map((o) => (
                <Link
                    key={o.label}
                    href={hrefFor(o.value)}
                    className={`rounded-full border px-3 py-1 text-xs ${photo === o.value ? 'bg-black text-white' : ''}`}
                >
                    {o.label}
                </Link>
            ))}
        </div>
    );
}
