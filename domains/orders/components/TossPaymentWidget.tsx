// 토스 결제 수단 위젯
import { FiCreditCard } from 'react-icons/fi';

export default function TossPaymentWidget() {
    return (
        <>
            <div className="flex justify-center gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        {<FiCreditCard className="h-5 w-5 text-blue-600" />}
                        <h2 className="text-base font-bold text-gray-900">
                            결제 수단
                        </h2>
                    </div>
                    {/* 토스 결제 위젯 플레이스홀더 */}
                    <div className="flex h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-6 text-center">
                        <span className="font-bold text-gray-800">
                            Toss Payments 결제 위젯 영역
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
