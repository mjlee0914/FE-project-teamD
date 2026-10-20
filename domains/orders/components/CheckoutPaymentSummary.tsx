// 상품금액·배송비·최종금액·동의·결제하기
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function CheckoutPaymentSummary() {
    return (
        <>
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 rounded-lg border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900">
                        최종 결제 금액
                    </h3>
                    <div className="space-y-2.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>총 상품금액</span>
                            <span className="font-semibold text-gray-900">
                                [총 상품금액]
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송비</span>
                            <span className="font-semibold text-gray-900">
                                [배송비]
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-gray-900">
                                총 결제금액
                            </span>
                            <span className="text-xl font-black text-blue-600">
                                [총 결제금액]
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-2 text-xs text-gray-600">
                            <input
                                type="checkbox"
                                name="paymentAgreed"
                                value="true"
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>
                                구매조건 확인 및 결제 진행에 동의합니다. (필수)
                            </span>
                        </label>
                        {/* {{state.errors?.paymentAgreed && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <FiAlertCircle className="h-3 w-3" />
                                <span>{state.errors.paymentAgreed}</span>
                            </p>
                        )} } */}
                    </div>

                    <Link href="order/complete">
                        <Button
                            type="submit"
                            // disabled={isPending}
                            className="h-12 w-full rounded-2xl bg-black font-bold text-white shadow-md shadow-blue-500/20 hover:bg-zinc-700"
                        >
                            결제하기
                            {/* {{isPending
                            ? '주문 생성 중...'
                            : `${formatPrice(totalAmount)} 결제하기`} } */}
                        </Button>
                    </Link>
                </div>
            </div>
            {/* </div> */}
        </>
    );
}
