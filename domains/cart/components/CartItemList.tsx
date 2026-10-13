'use client';

import { formatPrice } from '@/shared/utils/formatPrice';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

export default function CartItemList() {
    const [items, setItems] = useState(MOCK_CART_ITEMS);
    function changeQuantity(id: number, amount: number) {
        setItems(
            items.map((item) =>
                item.product.id === id
                    ? {
                          ...item,
                          quantity: Math.min(
                              99,
                              Math.max(item.quantity + amount, 1),
                          ),
                      }
                    : item,
            ),
        );
    }

    return (
        <ul className="mx-auto max-w-5xl px-4">
            {items.map((item) => {
                return (
                    <li
                        className="flex items-center gap-6 border-b py-1"
                        key={item.product.id}
                    >
                        <Image
                            className="h-24 w-24 shrink-0 md:h-36 md:w-36"
                            src={item.product.imageUrl}
                            alt="상품이미지"
                            width={150}
                            height={150}
                            unoptimized
                        ></Image>
                        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
                            <p className="font-medium md:flex-1">
                                상 품 명: {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                단 가: {formatPrice(item.product.price)}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    type="button"
                                    onClick={() =>
                                        changeQuantity(item.product.id, -1)
                                    }
                                >
                                    -
                                </Button>
                                <span className="w-12 text-center">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    type="button"
                                    onClick={() =>
                                        changeQuantity(item.product.id, +1)
                                    }
                                >
                                    +
                                </Button>
                            </div>
                            <p className="font-bold md:ml-5 md:w-40 md:text-right">
                                총 금액:{' '}
                                {formatPrice(
                                    item.product.price * item.quantity,
                                )}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
