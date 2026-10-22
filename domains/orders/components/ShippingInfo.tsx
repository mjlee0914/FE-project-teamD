// 배송지 입력 폼
'use client';
import { Input } from '@/shared/components/ui/input';
import { type ChangeEvent, useState } from 'react';
import { getLatestPaidOrderShippingInfoAction } from '../actions/getLatestPaidOrderShippingInfo.action';
import Script from 'next/script';

// 카카오 검색 결과 타입 정의
interface KakaoPostcodeData {
    zonecode: string; // 우편번호
    userSelectedType: 'R' | 'J'; // 도로명, 지번
    roadAddress: string; // 도로명 주소
    jibunAddress: string; // 지번 주소
}

// 카카오 우편번호 검색창 타입
interface KakaoPostCodeConstructor {
    new (options: {
        width?: number;
        height?: number;
        oncomplete: (data: KakaoPostcodeData) => void;
    }): {
        open: () => void;
    };
}

// window.kakao 타입
declare global {
    interface Window {
        kakao?: {
            Postcode: KakaoPostCodeConstructor;
        };
    }
}

const DELIVERY_MEMO_OPTIONS = [
    { value: 'door', label: '문 앞에 놓아주세요.' },
    { value: 'call', label: '배송 전에 연락해주세요.' },
    { value: 'security', label: '경비실에 맡겨주세요.' },
    { value: 'postbox', label: '택배함에 넣어주세요.' },
    { value: 'direct', label: '직접 입력' },
];

export default function ShippingInfo() {
    const [recipient, setRecipient] = useState('');
    const [phone, setPhone] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [address, setAddress] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [deliveryMemo, setDeliveryMemo] = useState('');
    const [deliveryMemoOption, setDeliveryMemoOption] = useState('');

    const recipientError =
        recipient !== '' && recipient.trim().length < 2
            ? '받는분 이름을 2글자 이상 입력해 주세요.'
            : null;

    const phoneError =
        phone !== '' && !/^010\d{8}$/.test(phone)
            ? '휴대폰 번호 11자리를 입력해 주세요'
            : null;

    const zipcodeError =
        zipcode !== '' && zipcode.length !== 5
            ? '우편번호 5자리를 입력해 주세요'
            : null;

    const addressDetailError =
        addressDetail == '' || addressDetail.trim().length < 2
            ? '상세 주소를 입력해 주세요.'
            : null;

    const handleLoadShippingInfo = async () => {
        const result = await getLatestPaidOrderShippingInfoAction();

        if (!result.success) {
            alert(result.message);
            return;
        }

        if (!result.data) {
            alert(result.message);
            return;
        }

        setRecipient(result.data.recipient ?? '');
        setPhone(result.data.recipient_phone ?? '');
        setZipcode(result.data.zipcode ?? '');
        setAddress(result.data.address ?? '');
        setAddressDetail(result.data.address_detail ?? '');

        const savedDeliveryMemo = result.data.delivery_memo ?? '';

        setDeliveryMemo(savedDeliveryMemo);

        const matchedOption = DELIVERY_MEMO_OPTIONS.find(
            (opt) => opt.value !== 'direct' && opt.label === savedDeliveryMemo,
        );

        setDeliveryMemoOption(
            matchedOption?.value ?? (savedDeliveryMemo ? 'direct' : ''),
        );
    };

    // deliveryMemo 문구 저장 함수
    const handleDeliveryMemoChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedValue = event.target.value;

        setDeliveryMemoOption(selectedValue);

        if (selectedValue === 'direct') {
            setDeliveryMemo('');
            return;
        }

        const selectedOption = DELIVERY_MEMO_OPTIONS.find(
            (opt) => opt.value === selectedValue,
        );

        setDeliveryMemo(selectedOption?.label ?? '');
    };

    const handlePostcodeSearch = () => {
        const popupWidth = 500;
        const popupHeight = 600;

        const kakao = window.kakao;

        if (!kakao) {
            alert(
                '주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.',
            );
            return;
        }

        new kakao.Postcode({
            width: popupWidth,
            height: popupHeight,
            oncomplete: (data) => {
                const selectedAddress =
                    data.userSelectedType === 'R'
                        ? data.roadAddress
                        : data.jibunAddress;

                setZipcode(data.zonecode);
                setAddress(selectedAddress);
                setAddressDetail('');
            },
        }).open({
            left: window.screen.width / 2 - popupWidth / 2,
            top: window.screen.height / 2 - popupHeight / 2,
            popupTitle: '우편번호 검색',
            popupKey: 'postcodePopup',
        });
    };

    return (
        <>
            {/* kakao 우편번호, 별도 api 키 없이 사용 가능 */}
            <Script
                src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
                strategy="afterInteractive"
                onReady={() => {
                    console.log('Kakao 우편번호 스크립트 준비 완료');
                }}
            />

            {/* 배송지 화면 영역 */}
            <div className="flex flex-col gap-6 border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="mb-2 text-lg font-bold text-gray-900">
                        배송지 정보
                    </h2>

                    <button
                        type="button"
                        className="h-8 w-fit cursor-pointer rounded-lg border bg-gray-100 px-3 text-sm font-medium hover:bg-gray-200"
                        onClick={handleLoadShippingInfo}
                    >
                        배송정보 불러오기
                    </button>
                </div>

                <form
                    id="shipping-form"
                    className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]"
                >
                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="recipient"
                    >
                        받는분
                    </label>
                    <div className="relative">
                        <Input
                            id="recipient"
                            name="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            aria-invalid={!!recipientError}
                            aria-describedby="recipient-error"
                        />

                        {recipientError && (
                            <p
                                id="recipient-error"
                                className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-600"
                            >
                                {recipientError}
                            </p>
                        )}
                    </div>

                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="phone"
                    >
                        연락처
                    </label>
                    <div className="relative">
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
                            aria-describedby="phone-error"
                        />
                        {phoneError && (
                            <p
                                id="phone-error"
                                className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-600"
                            >
                                {phoneError}
                            </p>
                        )}
                    </div>

                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="zipcode"
                    >
                        우편번호
                    </label>
                    <div className="relative flex gap-2">
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
                            aria-describedby="zipcode-error"
                        />
                        <button
                            type="button"
                            className="shrink-0 cursor-pointer rounded-lg border bg-gray-100 px-3 text-sm font-medium hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handlePostcodeSearch}
                        >
                            우편번호 찾기
                        </button>
                        {zipcodeError && (
                            <p
                                id="zipcode-error"
                                className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-600"
                            >
                                {zipcodeError}
                            </p>
                        )}
                    </div>

                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="address"
                    >
                        주소
                    </label>
                    <Input
                        id="address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="addressDetail"
                    >
                        상세주소
                    </label>
                    <div className="relative">
                        <Input
                            id="addressDetail"
                            name="addressDetail"
                            value={addressDetail}
                            onChange={(e) => setAddressDetail(e.target.value)}
                            aria-invalid={!!addressDetailError}
                            aria-describedby="address-detail-error"
                        />
                        {addressDetailError && (
                            <p
                                id="address-detail-error"
                                className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-600"
                            >
                                {addressDetailError}
                            </p>
                        )}
                    </div>

                    <label
                        className="text-md justify-self-end font-bold"
                        htmlFor="deliveryMemo"
                    >
                        배송 요청사항
                    </label>
                    <div className="space-y-2">
                        <select
                            id="deliveryMemo"
                            value={deliveryMemoOption}
                            onChange={handleDeliveryMemoChange}
                            className="h-8 w-full rounded-lg border px-2.5 text-sm"
                        >
                            <option value="">
                                배송 요청사항을 선택하세요.
                            </option>

                            {DELIVERY_MEMO_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {deliveryMemoOption === 'direct' && (
                            <Input
                                id="deliveryMemoDirect"
                                value={deliveryMemo}
                                onChange={(e) =>
                                    setDeliveryMemo(e.target.value)
                                }
                                autoFocus
                                placeholder="배송 요청사항을 입력하세요."
                                maxLength={200}
                            />
                        )}
                        <input
                            type="hidden"
                            name="deliveryMemo"
                            value={deliveryMemo}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
