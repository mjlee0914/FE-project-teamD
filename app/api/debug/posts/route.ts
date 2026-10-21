import { connection } from 'next/server';
import { store } from '@/domains/boards/lib/mockStore';

// [개발 전용] 서버 메모리(mockStore)에 있는 글을 JSON으로 확인하는 임시 주소
// - 예: /api/debug/posts  /  /api/debug/posts?boardId=free
// - 서버를 재시작하면 새 글은 사라지고 시드로 돌아감 (저장소가 서버 메모리라서)
// - 확인용이라 repository를 거치지 않고 store를 직접 읽음. 배포 전에 이 파일(app/api/debug)을 삭제할 것
export async function GET(request: Request) {
    // 운영 빌드에서는 열리지 않게 막음
    if (process.env.NODE_ENV === 'production') {
        return new Response('Not Found', { status: 404 });
    }

    // Cache Components에서는 읽기만 하는 GET이 빌드 때 한 번 만들어져 굳을 수 있어서
    // connection()으로 "요청 때마다 실행"하도록 알림 (Next 문서: 15-route-handlers.md)
    await connection();

    const boardId = new URL(request.url).searchParams.get('boardId');
    const posts = boardId
        ? store.posts.filter((p) => p.board_id === boardId)
        : store.posts;

    // 들여쓰기(2칸)로 보기 좋게 출력: Response.json은 한 줄로 붙여서 내보내서 직접 JSON.stringify(값, null, 2) 사용
    return new Response(
        JSON.stringify({ count: posts.length, posts }, null, 2),
        {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
    );
}
