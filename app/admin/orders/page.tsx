'use client';

import { MOCK_ORDER } from '@/shared/mocks/mockData';
import { useState, type FormEvent } from 'react';
import { Order } from '@/domains/orders/types/order.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import OrderInfoModal from '@/domains/admin/orders/components/OrderInfoModal';
import OrderTable from '@/domains/admin/orders/components/OrderTable';

export default function AdminOrderPage() {
    const [search, setSearch] = useState({
        id: '',
        status: '',
    });
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        setSearch({
            id: String(formData.get('searchId') ?? '').trim(),
            status: String(formData.get('searchStatus') ?? '').trim(),
        });
    }

    function handleOrderInfo(order: Order) {
        setSelectedOrder(order);
        setOpen(true);
    }

    const orders = MOCK_ORDER.filter((order) => {
        const matchesId = order.id
            .toLowerCase()
            .includes(search.id.toLowerCase());

        const matchesStatus = order.status.includes(search.status);

        return matchesId && matchesStatus;
    });

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold">주문 관리</h1>
            <form
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                onSubmit={handleSearch}
            >
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                    <h2 className="text-sm font-semibold text-gray-900">
                        주문 검색
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        입력한 조건을 모두 만족하는 주문을 조회합니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <label className="min-w-0 space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            주문 번호
                        </span>
                        <Input
                            type="text"
                            name="searchId"
                            className="h-10 border-gray-300 bg-white"
                        />
                    </label>
                    <label className="min-w-0 space-y-2">
                        <span className="block text-sm font-medium text-gray-700">
                            주문 상태
                        </span>
                        <Input
                            type="text"
                            name="searchStatus"
                            className="h-10 border-gray-300 bg-white"
                        />
                    </label>
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-500">
                        조건을 비우고 검색하면 전체 주문을 조회합니다.
                    </p>
                    <Button
                        type="submit"
                        className="h-10 w-full bg-gray-800 px-6 text-white hover:bg-gray-700 sm:w-auto"
                    >
                        검색
                    </Button>
                </div>
            </form>
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-700">
                    검색 결과{' '}
                    <span className="ml-1 text-gray-950 tabular-nums">
                        {orders.length}건
                    </span>
                </h2>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <OrderTable orders={orders} onClick={handleOrderInfo} />
                </div>
            </div>

            {selectedOrder && (
                <OrderInfoModal
                    open={open}
                    onOpenChange={setOpen}
                    order={selectedOrder}
                />
            )}
        </section>
    );
}
