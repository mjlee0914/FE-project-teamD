'use client';

import { useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function CheckoutForm() {
    const [phone, setPhone] = useState('');

    const phoneError =
        phone !== '' && !/^010\d{8}$/.test(phone)
            ? '휴대폰 번호 11자리를 입력해 주세요'
            : null;
    const [zipcode, setZipcode] = useState('');

    const zipcodeError =
        zipcode !== '' && zipcode.length !== 5
            ? '우편번호 5자리를 입력해 주세요'
            : null;
    return (
        <>
            <div className="flex justify-center gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-6 rounded-lg border p-6">
                        <h2 className="text-lg font-bold">고객 배송지 정보</h2>
                        <form className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]">
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="recipient"
                            >
                                받는 사람
                            </label>
                            <Input id="recipient" name="recipient" />
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="phone"
                            >
                                연락처
                            </label>
                            <div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 11),
                                        )
                                    }
                                    aria-invalid={!!phoneError}
                                />
                                {phoneError && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {phoneError}
                                    </p>
                                )}
                            </div>
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="address"
                            >
                                주소
                            </label>
                            <Input id="address" name="address" />
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="zipcode"
                            >
                                우편번호
                            </label>
                            <div>
                                <Input
                                    id="zipcode"
                                    name="zipcode"
                                    inputMode="numeric"
                                    value={zipcode}
                                    onChange={(e) =>
                                        setZipcode(
                                            e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 5),
                                        )
                                    }
                                    aria-invalid={!!zipcodeError}
                                />
                                {zipcodeError && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {zipcodeError}
                                    </p>
                                )}
                            </div>
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="addressDetail"
                            >
                                상세주소
                            </label>
                            <Input id="addressDetail" name="addressDetail" />
                            <label
                                className="text-md justify-self-end font-bold"
                                htmlFor="deliveryMemo"
                            >
                                배송 메모
                            </label>
                            <Input id="deliveryMemo" name="deliveryMemo" />
                        </form>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            {/* <FiCreditCard className="h-5 w-5 text-blue-600" /> */}
                            <h2 className="text-base font-bold text-gray-900">
                                결제 수단
                            </h2>
                        </div>
                        {/* 토스 결제 위젯 플레이스홀더 */}
                        <div className="flex h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-6 text-center">
                            <span className="font-bold text-gray-800">
                                Toss Payments 결제 위젯 영역
                            </span>
                            <p className="mt-1 text-xs text-gray-400">
                                9일 차 토스페이먼츠 연동 시 카드/간편결제 UI가
                                자동 렌더링됩니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4 rounded-lg border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900">
                            최종 결제 금액
                        </h3>
                        <div className="space-y-2.5 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>총 상품금액</span>
                                <span className="font-semibold text-gray-900">
                                    {/* {formatPrice(itemsTotal)} */}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>배송비</span>
                                <span className="font-semibold text-gray-900">
                                    {/* {formatPrice(shippingFee)} */}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs font-bold text-gray-900">
                                    총 결제금액
                                </span>
                                <span className="text-xl font-black text-blue-600">
                                    {/* {formatPrice(totalAmount)} */}
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
                                    구매조건 확인 및 결제 진행에 동의합니다.
                                    (필수)
                                </span>
                            </label>
                            {/* {state.errors?.paymentAgreed && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <FiAlertCircle className="h-3 w-3" />
                                <span>{state.errors.paymentAgreed}</span>
                            </p>
                        )} */}
                        </div>

                        <Link href="order/complete">
                            <Button
                                type="submit"
                                className="h-12 w-full text-base hover:bg-zinc-700"
                                // disabled={isPending}
                                // className="h-12 w-full rounded-2xl bg-black font-bold text-white shadow-md shadow-blue-500/20 hover:bg-zinc-700"
                            >
                                결제하기
                                {/* {isPending
                            ? '주문 생성 중...'
                            : `${formatPrice(totalAmount)} 결제하기`} */}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
