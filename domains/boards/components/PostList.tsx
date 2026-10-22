import { formatDate } from '../lib/formatDate';
import type { BoardSetting, CategoryOption, Post } from '../types/board.types';
import Link from 'next/link';
import Image from 'next/image';
import { DELETED_PRODUCT_NAME, displayAuthor, SECRET_TITLE } from '../lib/mask';
import { toImageSrc } from '../lib/imageUpload';

interface PostListProps {
    board: BoardSetting;
    posts: Post[];
    total: number; // 게시물 번호 계산용
    page: number;
    pageSize: number;
    categories: CategoryOption[]; // 분류 id → 이름 변환용
    productNames?: Record<string, string>;
    hideProduct?: boolean;
    hideCategory?: boolean; // 상품 페이지처럼 분류가 모두 같을 때 분류 열을 숨김
}

export default function PostList({
    board,
    posts,
    total,
    page,
    pageSize,
    categories,
    productNames,
    hideProduct,
    hideCategory,
}: PostListProps) {
    // board는 이 함수가 받은 인자라서 함수 안에서만 쓸 수 있음 (함수 밖에서 만들면 board를 못 찾음)
    const isQna = board.type === 'qna';

    // 고정글 강조 및 페이징이 연번을 해치지 않게 하기
    const offset = (page - 1) * pageSize;

    // 상품 연결 글이 하나라도 있으면 상품 컬럼 표출하고 상품 상세 페이지에서는 상품 컬럼을 숨기기
    const showProduct = !hideProduct && posts.some((p) => p.product_id);
    const showCategory = board.use_category && !hideCategory;

    // 썸네일 주소 (public/ 접두사 변환, 없으면 undefined)
    const thumbSrc = (p: Post) => toImageSrc(p.thumbnail_url);

    if (posts.length === 0) {
        return (
            <p className="text-muted-foreground py-16 text-center text-sm">
                등록된 게시글이 없습니다.
            </p>
        );
    }

    return (
        <table className="w-full border-t-2 border-t-black text-sm">
            <thead>
                <tr className="border-b text-center">
                    <th className="w-16 py-3">No.</th>
                    {showCategory && <th className="w-24">분류</th>}
                    {showProduct && <th className="w-40">상품</th>}
                    <th className="px-3">제목</th>
                    {board.use_rating && <th className="w-24">별점</th>}
                    <th className="w-24">작성자</th>
                    <th className="w-28">작성일</th>
                    <th className="w-16">조회수</th>
                    {isQna && <th className="w-24">상태</th>}
                </tr>
            </thead>
            <tbody>
                {posts.map((post, i) => (
                    <tr
                        key={post.id}
                        className={`${post.is_pinned ? 'bg-stone-100 font-semibold' : ''} border-b`}
                    >
                        <td className="py-3 text-center">
                            {post.is_pinned ? '📌' : total - offset - i}
                        </td>
                        {showCategory && (
                            <td className="text-center">
                                {categories.find(
                                    (c) => c.id === post.category_id,
                                )?.name ?? ''}
                            </td>
                        )}
                        {showProduct && (
                            <td className="px-2 text-center text-xs text-amber-800">
                                {post.product_id ? (
                                    <Link
                                        href={`/products/${post.product_id}`}
                                        title={
                                            productNames?.[post.product_id] ??
                                            DELETED_PRODUCT_NAME
                                        }
                                        className="block max-w-36 truncate hover:underline"
                                    >
                                        {productNames?.[post.product_id] ??
                                            DELETED_PRODUCT_NAME}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </td>
                        )}
                        {/* 제목을 클릭하면 해당 게시물로 이동 */}
                        <td
                            className={
                                board.use_thumbnail && thumbSrc(post)
                                    ? 'px-3 py-2'
                                    : 'px-3'
                            }
                        >
                            <Link
                                href={`/boards/${board.id}/${post.id}`}
                                className="flex items-center gap-3 hover:underline"
                            >
                                {/* 썸네일이 있는 글만 작은 이미지를 붙임 (없는 글은 빈 칸 없이 일반 목록처럼 보임) */}
                                {board.use_thumbnail && thumbSrc(post) && (
                                    <span className="relative block h-10 w-10 shrink-0 overflow-hidden bg-stone-100">
                                        <Image
                                            src={thumbSrc(post)!}
                                            alt=""
                                            fill
                                            sizes="40px"
                                            unoptimized={thumbSrc(
                                                post,
                                            )!.startsWith('data:')}
                                            className="object-cover"
                                        />
                                    </span>
                                )}
                                <span className="truncate">
                                    {isQna && post.is_secret
                                        ? SECRET_TITLE
                                        : post.title}
                                </span>
                            </Link>
                        </td>
                        {board.use_rating && (
                            <td className="text-center text-xs text-amber-500">
                                {post.rating
                                    ? '★'.repeat(post.rating) +
                                      '☆'.repeat(5 - post.rating)
                                    : '-'}
                            </td>
                        )}
                        <td className="text-center">
                            {displayAuthor(board, post.author_name)}
                        </td>
                        <td className="text-center">
                            {formatDate(post.created_at)}
                        </td>
                        <td className="text-center">{post.view_count}</td>
                        {isQna && (
                            <td className="text-center text-xs">
                                {post.answer ? (
                                    <span className="bg-[#8A8D6F] px-2 py-1 text-white">
                                        답변완료
                                    </span>
                                ) : (
                                    <span className="border px-2 py-1">
                                        답변대기
                                    </span>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
