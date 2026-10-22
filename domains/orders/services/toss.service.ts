// 토스페이먼츠 결제 승인 API (서버에서만 사용)
// 비밀 키(TOSS_SECRET_KEY)를 쓰기 때문에 절대 클라이언트 컴포넌트에서 import하지 않는다.

export interface TossPayment {
    paymentKey: string;
    orderId: string;
    status: string; // 예: DONE
    method: string; // 예: 카드, 간편결제
    totalAmount: number;
    approvedAt: string;
    [key: string]: unknown;
}

export type TossConfirmResult =
    | { ok: true; payment: TossPayment }
    | { ok: false; code: string; message: string };

export async function confirmTossPayment(
    paymentKey: string,
    orderId: string,
    amount: number,
): Promise<TossConfirmResult> {
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
        return {
            ok: false,
            code: 'NO_SECRET_KEY',
            message: '결제 설정이 되어 있지 않습니다.',
        };
    }

    // 토스 규칙: "시크릿키:" 를 base64로 바꿔서 Basic 인증에 넣는다
    const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

    const response = await fetch(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
            method: 'POST',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentKey, orderId, amount }),
            cache: 'no-store',
        },
    );

    const data = await response.json();

    if (!response.ok) {
        return {
            ok: false,
            code: data.code ?? 'UNKNOWN',
            message: data.message ?? '결제 승인에 실패했습니다.',
        };
    }

    return { ok: true, payment: data as TossPayment };
}
