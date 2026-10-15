"use client";

import { useOrders } from "@/domains/orders/hooks/useOrders";

export function OrdersList() {
  const { orders, loading, error } = useOrders();

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">오류: {error}</div>;
  if (orders.length === 0) return <div className="p-4">주문이 없습니다.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              주문번호
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              주문자
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              상태
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              최종 가격
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              주문일
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {order.id.slice(0, 8)}...
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.order_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span className="inline-block rounded bg-blue-100 px-2 py-1 text-sm">
                  {order.status}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ₩{order.final_price.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(order.created_at).toLocaleDateString("ko-KR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
