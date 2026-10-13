import Image from 'next/image';
import discount from './assets/clothes.png';
import sneakers from './assets/sneakers.png';
import blackfriday from './assets/blackfriday.png';
import { Button } from '@/shared/components/ui/button';

export default function EventBanner() {
    return (
        <>
            <section className="p-20">
                <div className="flex flex-col p-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                        이달의 혜택
                    </h1>
                    <p className="text-s mt-1 text-gray-500">
                        현재 진행중인 이벤트를 확인하고 혜택을 받아보세요.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-5">
                    <div className="relative">
                        <Image
                            src={discount}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />
                        <Button className="absolute inset-20 z-10">
                            Get 30% Off Coupon
                        </Button>
                    </div>
                    <div className="relative">
                        <Image
                            src={blackfriday}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />

                        <Button className="absolute inset-20 z-10">
                            Black Friday Sale
                        </Button>
                    </div>
                    <div className="relative">
                        <Image
                            src={sneakers}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />

                        <Button className="absolute top-80">
                            Shoes 70% Off
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
