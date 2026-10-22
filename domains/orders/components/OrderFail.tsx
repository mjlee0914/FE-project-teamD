import Link from 'next/link';
import { X } from 'lucide-react';

// 토스 에러 코드 중 자주 나오는 것만 쉬운 말로 바꿔서 보여준다
const FRIENDLY_MESSAGES: Record<string, string> = {
    PAY_PROCESS_CANCELED: '결제를 취소하셨어요.',
    PAY_PROCESS_ABORTED: '결제가 중간에 멈췄어요.',
    REJECT_CARD_COMPANY:
        '카드사에서 결제를 거절했어요. 다른 카드로 시도해 주세요.',
    AMOUNT_MISMATCH: '결제 금액이 주문 금액과 달라 결제를 진행하지 않았어요.',
    UNAUTHORIZED: '로그인 시간이 지났어요. 다시 로그인 후 결제해 주세요.',
};

const STEPS = ['장바구니', '주문/결제', '주문완료'];

export default function OrderFail({
    code,
    message,
    orderId,
}: {
    code?: string;
    message?: string;
    orderId?: string;
}) {
    const reason =
        (code && FRIENDLY_MESSAGES[code]) ??
        message ??
        '알 수 없는 이유로 결제에 실패했어요.';

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
            {/* 단계 표시: 주문/결제에서 멈춤 */}
            <ol className="flex items-center justify-center gap-2 text-xs md:gap-4 md:text-sm">
                {STEPS.map((step, index) => (
                    <li key={step} className="flex items-center gap-2 md:gap-4">
                        <span
                            className={
                                index === 1
                                    ? 'font-black text-gray-900'
                                    : 'text-gray-400'
                            }
                        >
                            {String(index + 1).padStart(2, '0')} {step}
                        </span>
                        {index < STEPS.length - 1 && (
                            <span className="text-gray-300" aria-hidden>
                                ›
                            </span>
                        )}
                    </li>
                ))}
            </ol>

            <div className="mt-10 flex flex-col items-center gap-3 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-red-500 text-white">
                    <X className="size-8" strokeWidth={3} />
                </span>
                <h1 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
                    결제에 실패했습니다
                </h1>
                <p className="text-sm text-gray-500">
                    결제가 완료되지 않아 주문이 접수되지 않았어요.
                </p>
            </div>

            <section className="mx-auto mt-8 max-w-md rounded-lg border border-red-100 bg-red-50/60 p-5 text-sm">
                <p className="font-bold text-red-600">실패 사유</p>
                <p className="mt-1 text-gray-700">{reason}</p>
                {(code || orderId) && (
                    <p className="mt-3 text-xs text-gray-400">
                        {code && <>오류 코드 {code}</>}
                        {code && orderId && ' · '}
                        {orderId && (
                            <>주문번호 {orderId.slice(0, 8).toUpperCase()}</>
                        )}
                    </p>
                )}
            </section>

            <div className="mx-auto mt-10 flex max-w-md gap-3">
                <Link
                    href="/cart"
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-black bg-white text-sm font-bold text-black transition-colors hover:bg-gray-100"
                >
                    장바구니로
                </Link>
                <Link
                    href="/checkout"
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white transition-colors hover:bg-zinc-700"
                >
                    다시 결제하기
                </Link>
            </div>
        </div>
    );
}
