'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLeftMenu() {
    const pathname = usePathname();

    const menus = [
        { href: '/admin/category', label: '카테고리 관리' },
        { href: '/admin/products', label: '상품 관리' },
        { href: '/admin/orders', label: '주문 관리' },
    ];

    return (
        <>
            <div className="flex h-full w-60 flex-col gap-3 border-r border-gray-600 bg-gray-700 p-3 text-gray-100">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className={`block rounded-md px-4 py-3 ${
                            pathname === menu.href
                                ? 'bg-gray-600 font-semibold text-white'
                                : 'text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {menu.label}
                    </Link>
                ))}
            </div>
        </>
    );
}
