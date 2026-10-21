import Link from 'next/link';

// 고객센터 랜딩페이지
const SUPPORT_LINKS = [
    {
        href: '/boards/faq',
        title: '자주 묻는 질문',
        description: '먼저 궁금한 점을 빠르게 찾아보세요.',
    },
    {
        href: '/boards/qna',
        title: '1:1 문의(Q&A)',
        description: '그 외 궁금한 점은 직접 문의하실 수 있어요.',
    },
];

export default function SupportPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8 border-b py-6">
                <p className="text-muted-foreground text-xs tracking-widest">
                    CUSTOMER CENTER
                </p>
                <h1 className="mt-1 text-2xl font-bold">고객센터</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    무엇을 도와드릴까요?
                </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
                {SUPPORT_LINKS.map((item) => (
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
