'use client';

import { useState } from 'react';
import { Input } from '@/shared/components/ui/input';

export default function ShippingAddress() {
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
        <div className="flex flex-col gap-6 rounded-lg border p-6">
            <h2 className="text-lg font-bold">고객 배송지 정보</h2>
            <div className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]">
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
                                e.target.value.replace(/\D/g, '').slice(0, 11),
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
                                e.target.value.replace(/\D/g, '').slice(0, 5),
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
            </div>
        </div>
    );
}
