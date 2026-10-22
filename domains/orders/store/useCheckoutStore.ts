'use client';
import { create } from 'zustand';
import type { CartItem } from '@/domains/cart/types/cart.types';

interface CartState {
    // checkoutItems -> CheckoutOrderItems, CheckoutForm
    checkoutItems: CartItem[];

    // setCheckoutItems -> CartItemList, 상품 상세 바로 구매
    setCheckoutItems: (items: CartItem[]) => void;

    // clearCheckoutItems -> 결제 완료 처리
    clearCheckoutItems: () => void;
}

const initialCheckoutItems: CartItem[] = [];

const useCheckoutStore = create<CartState>((set) => ({
    checkoutItems: initialCheckoutItems,

    setCheckoutItems: (items) => {
        set(() => ({
            checkoutItems: items,
        }));
    },

    clearCheckoutItems: () => {
        set(() => ({
            checkoutItems: [],
        }));
    },
}));

export default useCheckoutStore;
