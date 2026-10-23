'use client';

export default function ProductsError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="mb-3 text-xl font-semibold">
                상품 목록을 불러오지 못했어요.
            </h2>

            <p className="mb-6 text-sm text-gray-500">
                일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>

            <button
                type="button"
                onClick={() => reset()}
                className="rounded bg-black px-5 py-3 text-sm text-white"
            >
                다시 시도
            </button>
        </div>
    );
}
