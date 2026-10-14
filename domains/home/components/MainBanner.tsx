import Image from 'next/image';
import mainbanner from './assets/mainbanner.png';
import Link from 'next/link';
export default function MainBanner() {
    return (
        <section className="relative w-full">
            <Image
                src={mainbanner}
                alt="Main banner"
                className="h-auto w-full"
                sizes="100vw"
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end gap-5 bg-black/40 px-6 pb-20 text-white md:px-12">
                <h1 className="text-3xl font-bold md:text-5xl">
                    2026 DN F/W COLLECTION
                </h1>

                <h2 className="pl-2">
                    선선한 바람과 함께 시작되는 새로운 시즌,
                    <br />
                    편안한 착용감의 데일리 아이템을 특별 혜택으로 만나보세요.
                </h2>
                <div>
                    <Link href="/collection">
                        <button
                            type="button"
                            className="cursor-pointer bg-white pt-2 pr-10 pb-2 pl-10 text-xs text-black hover:bg-gray-300"
                        >
                            SHOP NOW
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
