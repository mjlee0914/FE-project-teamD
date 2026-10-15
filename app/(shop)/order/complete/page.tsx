import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

export default function Page() {
    return (
        <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
            <CircleCheck className="size-16 text-green-500" />
            <h1 className="text-2xl font-bold">주문 완료!</h1>
            <p className="text-gray-600">주문해 주셔서 감사합니다.</p>
            <div className="mt-6 flex gap-3">
                <Link
                    href="/products"
                    className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'w-21 border-black bg-white text-sm',
                    )}
                >
                    계속 쇼핑하기
                </Link>
                <Link href="/" className={buttonVariants()}>
                    메인페이지
                </Link>
            </div>
        </section>
    );
}
