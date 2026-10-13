import { Product } from '@/domains/products/types/product.types';

export interface CartItem {
    product: Product;
    quantity: number;
}
