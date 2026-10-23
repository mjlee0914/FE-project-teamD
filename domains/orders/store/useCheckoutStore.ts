'use client';
import { create } from 'zustand';
import type { CartItem } from '@/domains/cart/types/cart.types';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CartState {
    // checkoutItems -> CheckoutOrderItems, CheckoutForm
    checkoutItems: CartItem[];

    // setCheckoutItems -> CartItemList, 상품 상세 바로 구매
    setCheckoutItems: (items: CartItem[]) => void;

    // clearCheckoutItems -> 결제 완료 처리
    clearCheckoutItems: () => void;
}

const initialCheckoutItems: CartItem[] = [];

const useCheckoutStore = create<CartState>()(
    persist(
        (set) => ({
            checkoutItems: [],

            setCheckoutItems: (items) => {
                set({ checkoutItems: items });
            },

            clearCheckoutItems: () => {
                set({ checkoutItems: [] });
            },
        }),
        {
            name: 'checkout-storage',
            storage: createJSONStorage(() => sessionStorage),

            // 함수는 저장하지 않고 주문상품만 저장
            partialize: (state) => ({
                checkoutItems: state.checkoutItems,
            }),
        },
    ),
);

export default useCheckoutStore;
