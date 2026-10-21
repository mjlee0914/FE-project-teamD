import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function getCartItems() {
    await connection();

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data: cart_items, error: errorCartItems } = await supabase
        .from('cart_items')
        .select('id, quantity, option, products(id, name, price, gid, category_id, description)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

    if (errorCartItems) {
        console.error('Error fetching cart items:', errorCartItems);
        return [];
    }
    return cart_items.map((row) => {
        const product = Array.isArray(row.products)
            ? row.products[0]
            : row.products;

        return {
            id: row.id,
            quantity: row.quantity,
            option: row.option,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                gid: product.gid,
                category_id: product.category_id,
                description: product.description ?? '',
                imageUrl: '', //상품 이미지(file_info) 연결 후
            },
        };
    });
}
