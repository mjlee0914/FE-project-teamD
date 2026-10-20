import Link from 'next/link';

// 답을 못 찾았거나 비로그인 상태인 경우 돌려보냄
export default function AskQnaBox() {
    return (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 border bg-stone-50 px-6 py-8">
            <p className="text-m font-bold">원하는 답을 찾지 못하셨나요?</p>
            <Link
                href="/boards/qna"
                className="inline-block border border-black bg-white px-2 py-2 text-xs text-black hover:bg-black hover:text-white"
            >
                1:1 문의하기
            </Link>
        </div>
    );
}
