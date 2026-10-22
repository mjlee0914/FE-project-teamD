import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getBoard,
    getBoardCategories,
} from '@/domains/boards/lib/boardRepository';
import { getCurrentUser } from '@/domains/boards/lib/currentUser';
import { canWriteBoard } from '@/domains/boards/lib/permissions';
import { io } from 'next/cache';
import PostForm from '@/domains/boards/components/PostForm';
import { getProductNamesByIds } from '@/domains/products/queries/getProductNamesByIds.query';
import { hasPurchasedProduct } from '@/domains/boards/lib/purchase';

// 새 글 작성
export default async function NewPostPage({
    params,
    searchParams,
}: {
    params: Promise<{ boardId: string }>;
    searchParams: Promise<{ productId?: string }>;
}) {
    const { boardId } = await params;
    const sp = await searchParams;
    const board = await getBoard(boardId);
    if (!board) notFound();

    const user = await getCurrentUser();

    // 권한 없으면 안내
    if (!canWriteBoard(board, user)) {
        const message =
            board.write_role === 'admin'
                ? `${board.name}은 관리자만 작성할 수 있습니다.`
                : '로그인 후 작성할 수 있습니다.';
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                    <p className="text-3xl">⛔</p>
                    <h3 className="mt-1.5 mb-1 text-base font-bold">
                        작성 권한이 없습니다.
                    </h3>
                    <p className="mb-3.5 text-xs text-gray-500">{message}</p>
                    <Link
                        href={`/boards/${board.id}`}
                        className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                    >
                        목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const categories = await getBoardCategories(board.id);

    // 상품 연결: 리뷰는 필수, Q&A는 선택, 그 외 게시판은 무시
    // 주소의 productId는 조작될 수 있어서 실제 상품 여부 DB 확인
    let productName: string | undefined;
    const productId = board.product_scope === 'none' ? undefined : sp.productId;
    if (productId) {
        const names = await getProductNamesByIds([productId]);
        productName = names[productId];
    }

    // 리뷰는 상품 페이지에서만 작성
    if (board.product_scope === 'required' && !productName) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                    <p className="text-3xl">🛍️</p>
                    <h3 className="mt-1.5 mb-1 text-base font-bold">
                        리뷰는 상품 페이지에서 작성해주세요.
                    </h3>
                    <p className="mb-3.5 text-xs text-gray-500">
                        {board.name}은 상품 페이지의 리뷰 영역에서 작성할 수
                        있습니다.
                    </p>
                    {/* 지금은 마이페이지에 구매내역이 없으니까 상품목록으로 갑니다. */}
                    <Link
                        href="/products"
                        className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                    >
                        상품 보러가기
                    </Link>
                </div>
            </div>
        );
    }

    // 구매자만 쓸 수 있는 게시판(리뷰): 이 상품을 구매한 사용자인지 서버에서 확인
    if (board.require_purchase && productId && productName && user) {
        const purchased = await hasPurchasedProduct(user.id, productId);
        if (!purchased) {
            return (
                <div className="mx-auto max-w-5xl px-4 py-10">
                    <div className="flex min-h-[28rem] flex-col items-center justify-center border bg-stone-100 text-center">
                        <p className="text-3xl">🧾</p>
                        <h3 className="mt-1.5 mb-1 text-base font-bold">
                            구매하신 상품만 리뷰를 작성할 수 있어요.
                        </h3>
                        <p className="mb-3.5 text-xs text-gray-500">
                            {productName}의 결제 완료 주문이 확인되면 리뷰를
                            작성할 수 있습니다.
                        </p>
                        {/* 마이페이지에 구매내역이 생기면 그쪽으로 연결*/}
                        <Link
                            href={`/products/${productId}`}
                            className="inline-block border border-black bg-black px-4 py-1.5 text-xs text-white"
                        >
                            상품으로 돌아가기
                        </Link>
                    </div>
                </div>
            );
        }
    }

    await io(); // 글쓰기 화면을 열 때 gid 번호 만들거야 (미리 알림)
    const gid = crypto.randomUUID(); // 파일그룹아이디 생성

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8 border-b pb-6">
                <p className="text-muted-foreground text-xs tracking-widest">
                    NEW POST
                </p>
                <h1 className="mt-1 text-2xl font-bold">새 글 작성</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    {board.name}
                </p>
            </header>
            <PostForm
                board={board}
                gid={gid}
                categories={categories}
                productId={productName ? productId : undefined}
                productName={productName}
            />
        </div>
    );
}
