import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import { formatDate } from '@/shared/utils/formatDate';
import type { OrderReceipt } from '@/domains/orders/queries/getOrderReceipt.query';

const STEPS = ['장바구니', '주문/결제', '주문완료'];

// 장바구니 → 주문/결제 → 주문완료 단계 표시 (마지막 단계가 현재)
function OrderSteps() {
    return (
        <ol className="flex items-center justify-center gap-2 text-xs md:gap-4 md:text-sm">
            {STEPS.map((step, index) => {
                const isCurrent = index === STEPS.length - 1;
                return (
                    <li key={step} className="flex items-center gap-2 md:gap-4">
                        <span
                            className={
                                isCurrent
                                    ? 'font-black text-gray-900'
                                    : 'text-gray-400'
                            }
                        >
                            {String(index + 1).padStart(2, '0')} {step}
                        </span>
                        {!isCurrent && (
                            <span className="text-gray-300" aria-hidden>
                                ›
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

// 라벨 : 값 한 줄
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4 py-1.5 text-sm">
            <dt className="shrink-0 text-gray-500">{label}</dt>
            <dd className="text-right font-medium text-gray-900">{value}</dd>
        </div>
    );
}

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-black text-gray-900">{title}</h2>
            {children}
        </section>
    );
}

export default function OrderComplete({
    receipt,
}: {
    receipt: OrderReceipt | null;
}) {
    const order = receipt?.order;
    const items = receipt?.items ?? [];

    const totalPrice = order?.total_price ?? 0;
    const discountPrice = order?.discount_price ?? 0;
    const shippingFee = order?.shipping_fee ?? 0;
    const finalPrice =
        order?.final_price ?? totalPrice - discountPrice + shippingFee;

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
            <OrderSteps />

            {/* 완료 안내 */}
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-black text-white">
                    <Check className="size-8" strokeWidth={3} />
                </span>
                <h1 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
                    주문이 완료되었습니다
                </h1>
                <p className="text-sm text-gray-500">
                    DN Mall을 이용해 주셔서 감사합니다.
                </p>
                {order && (
                    <p className="mt-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs text-gray-600">
                        주문번호{' '}
                        <span className="font-bold tracking-wider text-gray-900">
                            {order.id.slice(0, 8).toUpperCase()}
                        </span>
                        {order.created_at && (
                            <>
                                <span className="mx-2 text-gray-300">|</span>
                                {formatDate(order.created_at)}
                            </>
                        )}
                    </p>
                )}
            </div>

            {/* 주문 상세 (주문 정보가 있을 때만) */}
            {order && (
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {items.length > 0 && (
                            <Card title={`주문 상품 (${items.length})`}>
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-center justify-between gap-4 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {item.product_name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {item.option &&
                                                        `${item.option} · `}
                                                    {item.quantity ?? 0}개
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold text-gray-900">
                                                {formatPrice(
                                                    (item.product_price ?? 0) *
                                                        (item.quantity ?? 0),
                                                )}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        <Card title="배송 정보">
                            <dl>
                                <InfoRow
                                    label="받는 분"
                                    value={order.recipient ?? '-'}
                                />
                                <InfoRow
                                    label="연락처"
                                    value={order.recipient_phone ?? '-'}
                                />
                                <InfoRow
                                    label="주소"
                                    value={
                                        order.address
                                            ? `${order.zipcode ? `(${order.zipcode}) ` : ''}${order.address} ${order.address_detail ?? ''}`
                                            : '-'
                                    }
                                />
                                {order.delivery_memo && (
                                    <InfoRow
                                        label="배송 메모"
                                        value={order.delivery_memo}
                                    />
                                )}
                            </dl>
                        </Card>
                    </div>

                    {/* 결제 정보 */}
                    <div className="lg:col-span-1">
                        <section className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/80 p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="text-sm font-black text-gray-900">
                                결제 정보
                            </h2>
                            <dl className="text-xs">
                                <InfoRow
                                    label="총 상품금액"
                                    value={formatPrice(totalPrice)}
                                />
                                <InfoRow
                                    label="할인금액"
                                    value={
                                        discountPrice > 0
                                            ? `-${formatPrice(discountPrice)}`
                                            : formatPrice(0)
                                    }
                                />
                                <InfoRow
                                    label="배송비"
                                    value={
                                        shippingFee === 0
                                            ? '무료'
                                            : formatPrice(shippingFee)
                                    }
                                />
                                <InfoRow
                                    label="결제수단"
                                    value={order.payment_method ?? '-'}
                                />
                            </dl>
                            <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                                <span className="text-xs font-bold text-gray-900">
                                    총 결제금액
                                </span>
                                <span className="text-xl font-black text-blue-600">
                                    {formatPrice(finalPrice)}
                                </span>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* 이동 버튼 */}
            <div className="mx-auto mt-10 flex max-w-md gap-3">
                <Link
                    href="/products"
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-black bg-white text-sm font-bold text-black transition-colors hover:bg-gray-100"
                >
                    계속 쇼핑하기
                </Link>
                <Link
                    href="/"
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white transition-colors hover:bg-zinc-700"
                >
                    메인으로
                </Link>
            </div>
        </div>
    );
}
