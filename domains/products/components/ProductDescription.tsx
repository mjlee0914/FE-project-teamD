
import Image from 'next/image';

interface ProductDescriptionProps {
    product: {
        id: number;
        name: string;
    };
}

// 상품별 상세 이미지 목록
const detailImages: Record<number, string[]> = {
    1: ['/products/anorak.gif'],

   
};

export default function ProductDescription({
    product,
}: ProductDescriptionProps) {
    const images = detailImages[product.id] ?? [];

    return (
        <section
            id="detail"
        >

            {/* 모든 상품 공통 브랜드 이미지 */}
            <Image
                src="/brand/DN Mall 로고.png"
                alt="DN MALL 로고 이미지"
                width={460}
                height={1000}
                className="h-auto w-full"
            />

            {/* 상품마다 다른 상세 사진 및 GIF */}
            {images.map((src, index) => (
                <Image
                    key={src}
                    src={src}
                    alt={`${product.name} 상세 이미지 ${index + 1}`}
                    width={800}
                    height={1000}
                    unoptimized={src.endsWith('.gif')}
                    className="h-auto w-full"
                />
            ))}
           
        </section>
    );
}
