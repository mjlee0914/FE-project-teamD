import { Product } from '@/domains/products/types/product.types';

export interface CartItem {
    id: string;
    quantity: number;
    product: Product;
    option: string | null;
}
