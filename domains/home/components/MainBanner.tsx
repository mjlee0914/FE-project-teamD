import Image from 'next/image';
import mainbanner from './assets/mainbanner.png';
import Link from 'next/link';
export default function MainBanner() {
    return (
        <>
            <section className="relative h-[60svh] max-h-160 min-h-105 w-full overflow-hidden">
                <Image
                    src={mainbanner}
                    alt="Main banner"
                    fill
                    priority
                    className="object-cover object-[center_15%]"
                    sizes="100vw"
                />
                <div className="absolute inset-0 z-10 flex flex-col justify-end gap-4 bg-black/40 px-6 pb-8 text-white md:gap-8 md:px-12 md:pb-12 lg:px-25 lg:pb-20">
                    <div className="flex flex-col gap-8">
                        <p className="tracking-widest">2026 FALL / WINTER</p>
                        <h1 className="text-3xl font-bold md:text-5xl">
                            Quiet Layers, <br />
                            Everyday Ease.
                        </h1>

                        <h2 className="pl-2">
                            선선한 바람과 함께 시작되는 새로운 시즌,
                            <br />
                            편안한 착용감의 데일리 아이템을 특별 혜택으로
                            만나보세요.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                        <Link href="/products">
                            <button
                                type="button"
                                className="cursor-pointer bg-white pt-2 pr-10 pb-2 pl-10 text-lg text-black hover:bg-gray-300"
                            >
                                SHOP NOW
                            </button>
                        </Link>
                        <Link href="boards/lookbook">
                            <button
                                className="cursor-pointer bg-black pt-2 pr-10 pb-2 pl-10 text-lg text-white hover:bg-zinc-800"
                                type="button"
                            >
                                LOOK BOOK
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-2 gap-y-6 border-b border-zinc-200 bg-white px-6 py-6 md:grid-cols-4 md:px-12">
                <div className="border-r border-zinc-200 text-center">
                    <p className="font-semibold">무료배송</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        5만원 이상 구매 시
                    </p>
                </div>

                <div className="border-r border-zinc-200 text-center">
                    <p className="font-semibold">무료 반품</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        수령 후 7일 이내
                    </p>
                </div>

                <div className="border-r border-zinc-200 text-center">
                    <p className="font-semibold">적립 5%</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        모든 회원 구매 시
                    </p>
                </div>

                <div className="text-center">
                    <p className="font-semibold">안전 결제</p>
                    <p className="mt-1 text-sm text-zinc-500">토스페이먼츠</p>
                </div>
            </section>
        </>
    );
}
