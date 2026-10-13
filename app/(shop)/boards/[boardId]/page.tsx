import { getPosts } from '@/domains/boards/lib/boardRepository';

export default async function BoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;

    // 404 에러 해소용 임시 반환값
    // return <div>게시판: {boardId}</div>;

    const result = await getPosts({ boardId });

    // 객체를 글자로 바꾸고(JSON.stringify) JSON 모양 그대로 출력하기(pre)
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
