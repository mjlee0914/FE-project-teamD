
import { Product } from '@/domains/products/types/product.types';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col justify-center p-3.5 hover:border-gray-200 hover:shadow-2xl">
            <Link
                href={`/products/${product.id}`}
                className="relative aspect-square w-full overflow-hidden bg-gray-50"
            >
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="mt-3 flex flex-1 flex-col">
                <div>
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                        <Link href={`/products/${product.id}`}>
                            {product.name}{' '}
                            <span className="text-[11px] font-medium text-red-400">
                                HOT
                            </span>
                        </Link>
                    </h3>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
