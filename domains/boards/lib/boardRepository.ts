import type { BoardSetting, Post } from '../types/board.types';
import { store } from './mockStore';

const DEFAULT_PAGE_SIZE = 10;

// 함수에 넣을 값 규격
export interface GetPostsParams {
    boardId: string;
    page?: number;
    pageSize?: number;
    q?: string;
    category?: string;
    // 상품 연동
    // productId: 특정 상품의 글만 (상품페이지 하단 섹션용)
    // Q&A 목록의 "상품" 칩은 별도 필터 없이 category === '상품' 으로 거름 (일반/상품 종류 탭은 쓰지 않기로 함)
    // 주의: 상품페이지에 리뷰·Q&A 섹션이 같이 있으면 page 파라미터가 겹치므로
    //       섹션별로 reviewPage / qnaPage 처럼 이름을 나눠서 page props로 넘길 것
    productId?: string;
}

export interface PostListResult {
    items: Post[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 정렬 규칙1 : 고정글이 앞으로 오고 고정 여부가 같으면 최신글이 앞으로
const byPinnedTheNewest = (a: Post, b: Post) => {
    if (!!a.is_pinned !== !!b.is_pinned) return a.is_pinned ? -1 : 1;
    return b.created_at.localeCompare(a.created_at);
};

// 정렬 규칙 2 : sort_order로 수동 정렬
const byManualOrder = (a: Post, b: Post) => {
    //번호가 없는 글은 무한대로 보고 맨 뒤로 보냄
    const an = a.sort_order ?? Infinity;
    const bn = b.sort_order ?? Infinity;
    // 둘 다 무한대면 NaN이 되므로 비교 처리
    if (an !== bn) return an < bn ? -1 : 1;
    return a.created_at.localeCompare(b.created_at);
};

// 정렬 규칙 3 : 게시판 성격에 맞는 정렬 규칙 적용
const sorterFor = (board: BoardSetting | null) =>
    board?.sort === 'manual' ? byManualOrder : byPinnedTheNewest;

// supabase 연동 대비 비동기 함수로 우선 작성하고 loading.tsx를 넣어서 시연

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
    productId,
}: GetPostsParams): Promise<PostListResult> {
    // 게시판 확인
    const board = await getBoard(boardId);

    // 검색어 준비
    const keyword = q?.trim().toLowerCase();

    // 조건부 조회
    const filtered = store.posts
        // 삭제되지 않은 글
        .filter((post) => post.board_id === boardId && post.deleted_at === null)
        // 분류가 없거나(조건이 없으면 통과) 분류가 같은 글
        .filter((post) => !category || post.category_id === category)
        // 특정 상품의 글
        .filter((post) => !productId || post.product_id === productId)
        // 키워드 검색
        .filter(
            (post) => !keyword || post.title.toLowerCase().includes(keyword),
        )
        // 사용성을 위해서 정렬을 따로 함수로 뺍니다.
        // .sort((a, b) => {
        //     if (!!a.is_pinned !== !!b.is_pinned) return a.is_pinned ? -1 : 1;
        //     return b.created_at.localeCompare(a.created_at);
        // });
        .sort(sorterFor(board));

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
// 지금은 게시물을 클릭해도 조회수가 올라가지 않고
// 나중에 Supabase로 갈 때 SQL로 올릴 예정 (지금은 정교하게 하지 않음...)
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

// 게시물 가져오기 - 이전글 다음글 이동 구현
export async function getAdjacentPosts(
    boardId: string,
    postId: string,
): Promise<{ prev: Post | null; next: Post | null }> {
    // 게시판 확인
    const board = await getBoard(boardId);
    const list = store.posts
        .filter((post) => post.board_id === boardId && post.deleted_at === null)
        .sort(sorterFor(board)); // 목록과 같은 정렬이어야 이전/다음글이 어긋나지 않음

    const index = list.findIndex((post) => post.id === postId);

    // 글이 삭제돼서 못 찾을 때
    if (index === -1) return { prev: null, next: null };

    // 맨 앞 글이면 앞 글(prev)은 없음 처리
    return { prev: list[index - 1] ?? null, next: list[index + 1] ?? null };
}

// 새 글 등록에 필요한 값
export interface CreatePostInput {
    boardId: string;
    userId: string;
    authorName: string;
    title: string;
    content: string;
    gid: string;
    categoryId?: string;
    isSecret?: boolean;
    thumbnailUrl?: string;
}

// 새 글 등록
export async function createPost(input: CreatePostInput): Promise<Post> {
    // 새 아이디 부여 (DB 붙이면 uuid로 적용)
    const maxNo = store.posts.reduce((max, p) => {
        const n = Number(p.id.replace('post-', ''));
        return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const now = new Date().toISOString();

    const post: Post = {
        id: `post-${maxNo + 1}`,
        board_id: input.boardId,
        category_id: input.categoryId,
        title: input.title,
        content: input.content,
        user_id: input.userId,
        author_name: input.authorName,
        gid: input.gid,
        view_count: 0,
        is_secret: input.isSecret,
        created_at: now,
        updated_at: now,
        deleted_at: null,
        thumbnail_url: input.thumbnailUrl,
    };

    store.posts.push(post);
    return post;
}

// 게시물 수정 가능 항목
export interface UpdatePostInput {
    title: string;
    content: string;
    categoryId?: string;
    isSecret?: boolean;
    thumbnailUrl?: string;
}

// 게시물 수정 - 나중에 supabase update로 교체 예정
export async function updatePost(
    boardId: string,
    postId: string,
    input: UpdatePostInput,
): Promise<Post | null> {
    const post = store.posts.find(
        (p) =>
            p.id === postId && p.board_id === boardId && p.deleted_at === null,
    );
    if (!post) return null;
    if (input.thumbnailUrl) post.thumbnail_url = input.thumbnailUrl;

    post.title = input.title;
    post.content = input.content;
    post.category_id = input.categoryId;
    post.is_secret = input.isSecret;
    post.updated_at = new Date().toISOString();
    return post;
}

// 게시물 삭제
export async function deletePost(
    boardId: string,
    postId: string,
): Promise<boolean> {
    const post = store.posts.find(
        (p) =>
            p.id === postId && p.board_id === boardId && p.deleted_at === null,
    );
    if (!post) return false;

    const now = new Date().toISOString();
    post.deleted_at = now;
    post.updated_at = now;
    return true;
}

// 게시판 분류 목록
export async function getBoardCategories(
    boardId: string,
): Promise<{ id: string; name: string }[]> {
    const board = store.boards.find((b) => b.id === boardId);
    if (!board) return [];
    return store.categories
        .filter((c) => c.parent_id === board.category_id)
        .filter((c) => c.deleted_at === null) // 삭제된 분류는 제외 (글·게시판과 같은 소프트 삭제 규칙)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((c) => ({ id: c.id, name: c.name }));
}

// Q&A 답변 저장 (글당 1개, 이미 글이 있으면 덮어쓰기(수정))
export async function saveAnswer(
    boardId: string,
    postId: string,
    content: string,
    answeredBy: string,
): Promise<boolean> {
    const post = store.posts.find(
        (p) =>
            p.id === postId && p.board_id === boardId && p.deleted_at === null,
    );
    if (!post) return false;

    const now = new Date().toISOString();
    const prev = post.answer;

    post.answer = prev
        ? // 수정: 최초 답변 정보는 유지하고 내용과 수정 시간만 변경
          { ...prev, content, updated_at: now }
        : // 최초 등록
          {
              content,
              answered_by: answeredBy,
              answered_at: new Date().toISOString(),
          };
    return true;
}
