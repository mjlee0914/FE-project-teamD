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
                        쿠폰부터 시즌 세일까지, 진행 중인 혜택을 확인해보세요.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-5">
                    <div>
                        <Image
                            src={discount}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />
                        <Button>쿠폰 혜택 보기</Button>
                    </div>
                    <div>
                        <Image
                            src={blackfriday}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />

                        <Button>블랙 프라이데이 세일</Button>
                    </div>
                    <div className="relative">
                        <Image
                            src={sneakers}
                            alt="card payment"
                            className="h-100 w-80"
                            sizes="100vw"
                        />

                        <Button>스니커즈 둘러보기</Button>
                    </div>
                </div>
            </section>
        </>
    );
}
