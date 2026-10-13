export default async function BoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params; // free, notice, qna

    // 404 에러 해소용 임시 반환값
    return <div>게시판: {boardId}</div>;
}
