"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Order {
  id: string;
  user_id: string;
  status: string;
  order_name: string;
  order_email: string;
  order_phone: string;
  recipient: string;
  recipient_phone: string;
  zipcode: string;
  address: string;
  address_detail: string;
  delivery_memo?: string;
  total_price: number;
  discount_price: number;
  final_price: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  shipping_fee: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 주문 조회
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // 특정 사용자의 주문 조회
  const fetchUserOrders = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // 새 주문 생성
  const createOrder = async (orderData: Omit<Order, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert([orderData])
        .select();

      if (insertError) throw insertError;
      if (data) {
        setOrders([data[0], ...orders]);
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
      throw err;
    }
  };

  // 주문 업데이트
  const updateOrder = async (
    id: string,
    updates: Partial<Omit<Order, "id" | "created_at">>
  ) => {
    try {
      const { data, error: updateError } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select();

      if (updateError) throw updateError;
      if (data) {
        setOrders(orders.map((order) => (order.id === id ? data[0] : order)));
      }
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
      throw err;
    }
  };

  // 주문 삭제
  const deleteOrder = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchUserOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
