// 동적 페이지 기반으로 개발 중인데 일단 정적으로 해야하니까 임시 조치
export default function Loading() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                <p className="text-3xl">불러오는 중...</p>
                <h3 className="mt-1.5 mb-1 text-base font-bold">
                    잠시만 기다려주세요
                </h3>
                <p className="mb-3.5 text-xs text-gray-500">금방 끝납니다.</p>
            </div>
        </div>
    );
}
