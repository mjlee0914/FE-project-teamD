import type { BoardSetting, FaqItem, Post } from '../types/board.types';
import { store } from './mockStore';

const DEFAULT_PAGE_SIZE = 10;

// 함수에 넣을 값 규격
export interface GetPostsParams {
    boardId: string;
    page?: number;
    pageSize?: number;
    q?: string;
    category?: string;
}

export interface PostListResult {
    items: Post[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// supabase 연동 대비 비동기 함수

// 게시물 목록
export async function getBoard(boardId: string): Promise<BoardSetting | null> {
    // 조건에 맞는 첫 번째 항목을 돌려주고 없으면 undefined
    return store.boards.find((board) => board.id === boardId) ?? null;
}

export async function getPosts({
    boardId,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    q,
    category,
}: GetPostsParams): Promise<PostListResult> {
    // 검색어 준비
    const keyword = q?.trim().toLowerCase();

    // 조건부 조회
    const filtered = store.posts
        // 삭제되지 않은 글
        .filter((post) => post.board_id === boardId && post.deleted_at === null)
        // 분류가 없거나(조건이 없으면 통과) 분류가 같은 글
        .filter((post) => !category || post.category === category)
        // 키워드 검색
        .filter(
            (post) => !keyword || post.title.toLowerCase().includes(keyword),
        )
        // 고정 여부가 다르면 고정글이 앞으로, 고정 여부가 같으면 최신글이 앞으로
        .sort((a, b) => {
            if (!!a.is_pinned !== !!b.is_pinned) return a.is_pinned ? -1 : 1;
            return b.created_at.localeCompare(a.created_at);
        });

    // 페이지 계산
    const total = filtered.length;
    // 필요한 페이지 수 계산
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    // 이상치가 들어와도 토탈페이지로 맞추기
    const currentPage = Math.min(Math.max(1, page), totalPages);
    // 페이지가 시작하는 위치
    const start = (currentPage - 1) * pageSize;

    return {
        items: filtered.slice(start, start + pageSize),
        total: total,
        page: currentPage,
        pageSize,
        totalPages,
    };
}

// 게시물 가져오기
export async function getPost(
    boardId: string,
    postId: string,
): Promise<Post | null> {
    return (
        store.posts.find(
            (post) =>
                post.id === postId &&
                post.board_id === boardId &&
                post.deleted_at === null,
        ) ?? null
    );
}

export async function getFaqs(category?: string): Promise<FaqItem[]> {
    return (
        store.faqs
            .filter((faq) => faq.deleted_at === null)
            .filter((faq) => !category || faq.category === category)
            // 작은 번호를 앞으로 가게 하기
            .sort((a, b) => a.sort_order - b.sort_order)
    );
}
