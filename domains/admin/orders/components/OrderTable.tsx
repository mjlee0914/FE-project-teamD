import type { Order } from '@/domains/orders/types/order.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { formatPrice } from '@/shared/utils/formatPrice';
import { formatDate } from '@/shared/utils/formatDate';

interface OrderTableProps {
    orders: Order[];
    onClick: (order: Order) => void;
}

export default function OrderTable({ orders, onClick }: OrderTableProps) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>ID</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>주문자명</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>핸드폰</TableHead>
                        <TableHead>주문일자</TableHead>
                        <TableHead>결제(예정) 금액</TableHead>
                        <TableHead>작업</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.length <= 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="h-24 text-center text-gray-500"
                            >
                                등록된 주문이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.order_name}</TableCell>
                                <TableCell>{order.order_email}</TableCell>
                                <TableCell>{order.order_phone}</TableCell>
                                <TableCell>
                                    {formatDate(order.created_at ?? '')}
                                </TableCell>
                                <TableCell>
                                    {formatPrice(order.final_price ?? 0)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        onClick={() => onClick(order)}
                                    >
                                        상세
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
