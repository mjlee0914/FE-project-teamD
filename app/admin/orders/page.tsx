'use client';

import { MOCK_ORDER } from '@/shared/mocks/mockData';
import { useState, type FormEvent } from 'react';
import { Order } from '@/domains/orders/types/order.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import OrderInfoModal from '@/domains/admin/orders/components/OrderInfoModal';
import OrderTable from '@/domains/admin/orders/components/OrderTable';

export default function AdminOrderPage() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const keyword = String(formData.get('searchValue') ?? '');

        setSearchKeyword(keyword.trim());
    }

    function handleOrderInfo(order: Order) {
        setSelectedOrder(order);
        setOpen(true);
    }

    const orders = searchKeyword
        ? MOCK_ORDER.filter((order) =>
              order.id
                  .toLowerCase()
                  .includes(searchKeyword.toLocaleLowerCase()),
          )
        : MOCK_ORDER;

    return (
        <>
            <p className="text-3xl font-bold">주문 관리</p>
            <div className="p-3">
                <form className="flex flex-col gap-3" onSubmit={handleSearch}>
                    <div className="flex">
                        <span className="w-30">주문 번호</span>
                        <Input type="text" name="searchValue"></Input>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="submit">검색</Button>
                    </div>
                </form>
            </div>
            <div>
                <OrderTable orders={orders} onClick={handleOrderInfo} />
            </div>

            {selectedOrder && (
                <OrderInfoModal
                    open={open}
                    onOpenChange={setOpen}
                    order={selectedOrder}
                />
            )}
        </>
    );
}
