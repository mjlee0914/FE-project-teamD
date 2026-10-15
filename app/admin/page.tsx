import { MOCK_ORDER } from '@/shared/mocks/mockData';
import Link from 'next/link';
import { ArrowUpRight, Bell, ShoppingBag } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatPrice';

const NOTIFICATION_LIMIT = 5;

const statusStyles: Record<string, string> = {
    결제대기: 'bg-amber-50 text-amber-700 ring-amber-200',
    결제완료: 'bg-blue-50 text-blue-700 ring-blue-200',
    상품준비중: 'bg-violet-50 text-violet-700 ring-violet-200',
    배송중: 'bg-sky-50 text-sky-700 ring-sky-200',
    배송완료: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    주문취소: 'bg-red-50 text-red-700 ring-red-200',
};

export default function AdminPage() {
    const recentOrders = [...MOCK_ORDER]
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        .slice(0, NOTIFICATION_LIMIT);

    return (
        <section className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">관리자 홈</h1>
                <p className="text-sm text-gray-500">
                    최근 주문과 처리 상태를 확인하세요.
                </p>
            </div>

            <section
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                aria-labelledby="order-notifications-title"
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800 text-white">
                            <Bell className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <h2
                                id="order-notifications-title"
                                className="font-semibold text-gray-900"
                            >
                                주문 알림
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                최근 접수된 주문 {recentOrders.length}건
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
                    >
                        전체 주문 보기
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>

                <ul className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                        <li
                            key={order.id}
                            className="flex items-start gap-3 px-5 py-5 transition-colors hover:bg-gray-50 sm:gap-4"
                        >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <ShoppingBag
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {order.order_name}님의 주문
                                    </p>
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[order.status] ?? 'bg-gray-100 text-gray-700 ring-gray-200'}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="font-mono text-xs break-all text-gray-500">
                                    주문 번호 · {order.id}
                                </p>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <time
                                        dateTime={order.created_at}
                                        className="text-xs text-gray-400"
                                    >
                                        {formatDate(order.created_at)}
                                    </time>
                                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                                        {formatPrice(order.final_price)}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                    {recentOrders.length === 0 && (
                        <li className="px-5 py-12 text-center text-sm text-gray-500">
                            아직 접수된 주문이 없습니다.
                        </li>
                    )}
                </ul>
            </section>
        </section>
    );
}
