import Image from 'next/image';
import mainbanner from './assets/mainbanner.png';
import { Button } from '@/components/ui/button';

export default function MainBanner() {
    return (
        <section className="relative w-full">
            <Image
                src={mainbanner}
                alt="Main banner"
                className="h-auto w-full"
                sizes="100vw"
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-center gap-5 bg-black/40 px-6 text-white md:px-12">
                <h1 className="text-3xl font-bold md:text-5xl">
                    트렌디한 스타일의 완성, <br />
                    스파르타 셀렉션
                </h1>
                <p>
                    편안한 착용감과 미니멀한 실루엣의 데일리 아이템을 특별
                    혜택으로 만나보세요.
                </p>
                <div>
                    <Button>SHOP NOW</Button>
                </div>
            </div>
        </section>
    );
}
