// 초기 코드입니다
// 최신 주문 조회 함수
// 서버 supabase 사용하는 일반 조회 함수
// use server 없이 서버 코드에서만 호출

import { createServerClient } from '@/lib/supabase';

// 배송지 조회 결과의 모양을 TypeScript에 알려주는 타입
// type을 붙였기 때문에 실제 실행 코드에는 포함되지 않음 (타입검사에만 필요하며 실행될 때 사라짐), 브라우저나 서버가 사용하지 않음
import type { OrderShippingInfo } from '../types/order.types';

type ShippingInfoResult = OrderShippingInfo | null;

export async function getLatestPaidOrderShippingInfo(
    userId: string,
): Promise<ShippingInfoResult> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
            recipient,
            recipient_phone,
            zipcode,
            address,
            address_detail,
            delivery_memo,
            payments!inner(status)  
        `, // orders와 FK관계인 payments테이블 접근 (relation!inner(column))
        )
        .eq('user_id', userId)

        // 연결된 Payment 테이블에서
        // 결제 상태가 DONE인 주문만 조회
        .eq('payments.status', 'DONE')

        // 최신 주문을 판단할 created_at이 있는 주문만 조회
        .not('created_at', 'is', null)

        // created_at 최신순 정렬 (내림차순)
        .order('created_at', { ascending: false })
        // 정렬 결과에서 첫 번째 주문 한 건만 선택
        .limit(1)

        // 결과를 객체 하나 or null로 받음
        // 주문이 있으면 객체, 없으면 null
        .maybeSingle();

    // supabase error -> action에 전달
    if (error) {
        throw error;
    }

    // 조건에 맞는 주문이 없을 때 배송지 정보 null로 반환
    if (!data) {
        return null;
    }

    return {
        recipient: data.recipient,
        recipient_phone: data.recipient_phone,
        zipcode: data.zipcode,
        address: data.address,
        address_detail: data.address_detail,
        delivery_memo: data.delivery_memo,
    };
}
