import Link from 'next/link';

// 고객센터 랜딩으로 돌아가기
export default function SupportHomeLink() {
    return (
        <Link
            href="/boards/support"
            className="text-muted-foreground mb-3 inline-block text-xs hover:text-black hover:underline"
        >
            ← 고객센터 홈
        </Link>
    );
}
