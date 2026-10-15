'use client';
import { create } from 'zustand';

interface CartStore {
    count: number;
    setCount: (count: number) => void;
}

export default create<CartStore>((set) => ({
    count: 0,
    setCount: (count: number) => {
        set(() => ({ count }));
    },
}));
