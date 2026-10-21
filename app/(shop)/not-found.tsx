import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                <p className="text-3xl">404</p>
                <h3 className="mt-1.5 mb-1 text-base font-bold">
                    페이지를 찾을 수 없습니다.
                </h3>
                <p className="mb-3.5 text-xs text-gray-500">
                    주소가 잘못되었거나 삭제된 페이지입니다.
                </p>
                <Link
                    href="/"
                    className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                >
                    홈으로
                </Link>
            </div>
        </div>
    );
}
