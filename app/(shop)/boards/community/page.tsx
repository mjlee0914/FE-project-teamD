import Link from 'next/link';

// 커뮤니티 랜딩페이지 (고객센터 랜딩 /boards/support와 같은 구조)
// - 고정 폴더라 [boardId]보다 먼저 열림 → 'community'라는 게시판 id는 만들지 않음
const COMMUNITY_LINKS = [
    {
        href: '/boards/free',
        title: '자유게시판',
        description: '자유롭게 이야기를 나눠 보세요.',
    },
    {
        href: '/boards/lookbook',
        title: '룩북',
        description: '우리가 입은 가을, 유저들의 스타일링',
    },
];

export default function CommunityPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8 border-b py-6">
                <p className="text-muted-foreground text-xs tracking-widest">
                    COMMUNITY
                </p>
                <h1 className="mt-1 text-2xl font-bold">커뮤니티</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    이야기를 나누고 스타일을 공유해 보세요.
                </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
                {COMMUNITY_LINKS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="border p-6 transition hover:border-black"
                    >
                        <h2 className="text-base font-bold">{item.title}</h2>
                        <p className="text-muted-foreground mt-2 text-xs">
                            {item.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
