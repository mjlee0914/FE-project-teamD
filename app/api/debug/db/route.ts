import { connection } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// [개발 전용] Supabase 연결 확인용 임시 주소 (PLAN U24). 배포 전에 이 파일(app/api/debug)을 삭제할 것
// - 열면 서버에서 boards 테이블을 읽은 결과(또는 오류 메시지)를 JSON으로 보여 줌
// - data에 게시판 id가 나옴: 연결 OK + 시드 있음 + 읽기 권한 열림
// - data가 []: 연결은 됐지만 시드가 없거나 RLS가 막음 / error에 메시지: 그 문구가 원인
export async function GET() {
    // 운영 빌드에서는 열리지 않게 막음
    if (process.env.NODE_ENV === 'production') {
        return new Response('Not Found', { status: 404 });
    }
    // 요청 때마다 실행되게 (빌드 때 굳지 않게)
    await connection();

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('boards')
        .select('id')
        .limit(10);

    // 키는 출력하지 않고 결과와 오류 메시지만
    return new Response(
        JSON.stringify({ data, error: error?.message ?? null }, null, 2),
        {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
    );
}
