import { Product } from '@/domains/products/types/product.types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface ShippingAddress {
    recipient: string;
    phone: string;
    address: string;
    addressDetail: string;
}
