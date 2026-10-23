import { createServerClient } from '@/lib/supabase';
import type { CartItem } from '@/domains/cart/types/cart.types';
import type { Product } from '@/domains/products/types/product.types';
import {
    getProductImageUrls,
    DEFAULT_PRODUCT_IMAGE,
} from '@/domains/products/queries/getProductImageUrls.query';

function shuffle<T>(list: T[]): T[] {
    return [...list].sort(() => Math.random() - 0.5);
}

export async function getRecommends(cartItems: CartItem[]): Promise<Product[]> {
    const supabase = createServerClient();

    //장바구니에 담은 상품 id들, 카테고리 id들 모으기
    const cartProductIds = cartItems.map((item) => item.product.id);
    const categoryIds = [
        ...new Set(cartItems.map((item) => item.product.category_id)),
    ];

    //상품 후보 가져오기 (전체 상품 중 최대 50개)
    const { data, error } = await supabase
        .from('products')
        .select('id, name, price, gid, category_id, description')
        .limit(50);

    if (error || !data) return [];

    // 장바구니에 이미 있는 상품은 빼기
    const candidates = data.filter((p) => !cartProductIds.includes(p.id));

    // 같은 카테고리 2개
    const sameCategory = shuffle(
        candidates.filter((p) => categoryIds.includes(p.category_id)),
    ).slice(0, 2);

    // 나머지에서 랜덤으로 채우기 (같은 카테고리가 2개 안 되면 그만큼 더)
    const pickedIds = sameCategory.map((p) => p.id);
    const random = shuffle(
        candidates.filter((p) => !pickedIds.includes(p.id)),
    ).slice(0, 3 - sameCategory.length);

    // 고른 상품들의 이미지를 한 번에 조회
    const picked = [...sameCategory, ...random];
    const imageUrls = await getProductImageUrls(picked.map((p) => p.gid));

    // ⑥ 화면에서 쓰는 Product 모양으로 바꿔서 돌려주기
    return picked.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        gid: p.gid ?? '',
        category_id: p.category_id,
        description: p.description ?? '',
        imageUrl: imageUrls.get(p.gid) ?? DEFAULT_PRODUCT_IMAGE,
    }));
}
