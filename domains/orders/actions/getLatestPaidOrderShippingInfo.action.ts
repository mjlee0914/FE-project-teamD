// server에서 로그인 사용자 확인 server action
// 로그인 사용자 확인 -> query 호출 -> 화면이 이해할 수 있는 결과로 바꿈.
'use server';

import { createServerClient } from '@/lib/supabase';

// orders table 조회 담당 함수 가져오기
import { getLatestPaidOrderShippingInfo } from '../queries/getLatestPaidOrderShippingInfo';
import type { ShippingInfoActionResult } from '../types/order.types';

// ShippingInfo client component에서 호출할 함수 정의 (배송정보 불러오기 버튼 클릭시 호출)
export async function getLatestPaidOrderShippingInfoAction(): Promise<ShippingInfoActionResult> {
    try {
        const supabase = await createServerClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        // 로그인 세션 만료 | 다른 탭에서 로그아웃 | 로그인하지 않은 사용자가 Action 직접 호출할 경우 검증
        if (error || !user) {
            return {
                success: false,
                message:
                    '로그인 세션을 확인할 수 없습니다. 다시 로그인해 주세요.',
            };
        }

        // 로그인 사용자 확인 성공시 query func에 사용자 UUID 전달
        const shippingInfo = await getLatestPaidOrderShippingInfo(user.id);

        // query 조건에 맞는 주문이 없을 때
        if (!shippingInfo) {
            return {
                // DB조회 자체는 정상적으로 끝났으므로 true
                success: true,
                data: null,
                message: '최근 배송지 정보가 없습니다.',
            };
        }

        return {
            success: true,
            data: shippingInfo,
        };
    } catch (error) {
        // query에서 throw된 supabase 오류 등이 전달됨

        // 개발자: 콘솔에서 서버 로그로 실제 원인 확인
        console.error('최근 배송지 조회 실패: ', error);

        // 사용자: 간단한 메시지 반환받음
        return {
            success: false,
            message: '배송지 정보를 불러오지 못했습니다.',
        };
    }
}
