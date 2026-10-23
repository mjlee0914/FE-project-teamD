import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import {
    getProductImageUrls,
    DEFAULT_PRODUCT_IMAGE,
} from '@/domains/products/queries/getProductImageUrls.query';

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
        .select(
            'id, quantity, option, products(id, name, price, gid, category_id, description)',
        )
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

    if (errorCartItems) {
        console.error('Error fetching cart items:', errorCartItems);
        return [];
    }
    // 상품 이미지(file_group → file_info)를 한 번에 조회해서 gid 로 찾아 쓴다
    const products = cart_items.map((row) =>
        Array.isArray(row.products) ? row.products[0] : row.products,
    );
    const imageUrls = await getProductImageUrls(products.map((p) => p?.gid));

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
                imageUrl: imageUrls.get(product.gid) ?? DEFAULT_PRODUCT_IMAGE,
            },
        };
    });
}
