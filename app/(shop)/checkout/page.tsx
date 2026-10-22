import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/domains/orders/components/CheckoutForm';
import { getProfile } from '@/domains/auth/queries/getProfile.query';

// 로그인한 사람만 주문할 수 있다. 토스 위젯에는 사용자 id를 구매자 키로 넘긴다.
async function CheckoutContent() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return <CheckoutForm customerKey={profile.id} />;
}

export default function CheckoutPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h3 className="mb-6 text-2xl font-black text-gray-900">
                주문/결제
            </h3>
            <Suspense
                fallback={
                    <p className="py-20 text-center text-sm text-gray-500">
                        주문 정보를 불러오는 중...
                    </p>
                }
            >
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
