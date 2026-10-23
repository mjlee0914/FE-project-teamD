import { createServerClient } from '@/lib/supabase';
import type { Post } from '../types/board.types';

// 게시판 분류
export interface BoardRow {
    id: string;
    category_id: string;
}

// 게시판 조회
export async function fetchBoardRow(boardId: string): Promise<BoardRow | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('boards')
        .select('id, category_id')
        .eq('id', boardId)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) throw new Error(`게시판 조회 실패: ${error.message}`);
    return data;
}

// 게시판 루트 분류의 칩 조회
export async function fetchCategoryChildren(
    rootId: string,
): Promise<{ id: string; name: string }[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('category')
        .select('id, name')
        .eq('parent_id', rootId)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });

    if (error) throw new Error(`분류 조회 실패: ${error.message}`);
    return data ?? [];
}

// 게시글 읽기
interface PostRow {
    id: string;
    board_id: string | null;
    category_id: string | null;
    title: string;
    content: string | null;
    user_id: string | null;
    author_name: string | null;
    gid: number | null; // DB는 bigint
    view_count: number | null;
    sort_order: number | null;
    is_pinned: boolean | null;
    is_secret: boolean | null;
    thumbnail_url: string | null;
    product_id: string | null;
    rating: number | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

interface AnswerRow {
    content: string | null;
    answered_at: string | null;
    updated_at: string | null;
}

// Q&A 답변 읽기
const POST_SELECT = '*, post_answers(content, answered_at, updated_at)';

// post_id 에 배열이 아닌 객체가 와도 안전하게 처리
type PostWithAnswerRow = PostRow & {
    post_answers: AnswerRow | AnswerRow[] | null;
};

// UUID 정규화
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 게시글 작성 (게시글 등록)
function toPost(row: PostWithAnswerRow): Post {
    const a = Array.isArray(row.post_answers)
        ? row.post_answers[0]
        : row.post_answers;

    return {
        id: row.id,
        board_id: row.board_id ?? '',
        category_id: row.category_id ?? undefined,
        title: row.title,
        content: row.content ?? '',
        user_id: row.user_id,
        author_name: row.author_name ?? '',
        gid: String(row.gid ?? ''), // DB bigint → 화면 문자열 (저장은 U17 전까지 NULL)
        view_count: row.view_count ?? 0,
        sort_order: row.sort_order ?? undefined,
        is_pinned: row.is_pinned ?? false,
        is_secret: row.is_secret ?? false,
        thumbnail_url: row.thumbnail_url ?? undefined,
        product_id: row.product_id,
        rating: row.rating ?? undefined,
        created_at: row.created_at ?? '',
        updated_at: row.updated_at ?? row.created_at ?? '',
        deleted_at: row.deleted_at,
        answer: a
            ? {
                  content: a.content ?? '',
                  // 관리자 역할이면 무조건 글쓴이는 관리자
                  answered_by: '관리자',
                  answered_at: a.answered_at ?? '',
                  // 답변 시각이 다르면 답변이 갱신된 상태로 인식
                  updated_at:
                      a.updated_at && a.updated_at !== a.answered_at
                          ? a.updated_at
                          : undefined,
              }
            : undefined,
    };
}

// 게시판 글 목록 보기
export async function fetchPosts(boardId: string): Promise<Post[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .eq('board_id', boardId)
        .is('deleted_at', null);

    if (error) throw new Error(`글 목록 조회 실패: ${error.message}`);
    return ((data ?? []) as unknown as PostWithAnswerRow[]).map(toPost);
}

// 게시판 글 상세 보기
export async function fetchPost(
    boardId: string,
    postId: string,
): Promise<Post | null> {
    if (!UUID_REGEX.test(postId)) return null;

    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .eq('id', postId)
        .eq('board_id', boardId)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) throw new Error(`글 조회 실패: ${error.message}`);
    return data ? toPost(data as unknown as PostWithAnswerRow) : null;
}

// 게시글 작성
export interface NewPostValues {
    board_id: string;
    category_id?: string;
    title: string;
    content: string;
    user_id: string;
    author_name: string;
    is_secret?: boolean;
    thumbnail_url?: string;
    rating?: number;
    product_id?: string;
}

export async function insertPostRow(v: NewPostValues): Promise<Post> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('posts')
        .insert({
            board_id: v.board_id,
            category_id: v.category_id ?? null,
            title: v.title,
            content: v.content,
            user_id: v.user_id,
            author_name: v.author_name,
            is_secret: v.is_secret ?? false,
            thumbnail_url: v.thumbnail_url ?? null,
            rating: v.rating ?? null,
            product_id: v.product_id ?? null,
        })
        .select(POST_SELECT)
        .single();

    if (error) throw new Error(`글 저장 실패: ${error.message}`);
    return toPost(data as unknown as PostWithAnswerRow);
}

// 게시글 수정
export interface EditPostValues {
    title: string;
    content: string;
    category_id?: string;
    is_secret?: boolean;
    thumbnail_url?: string;
    rating?: number;
}

export async function updatePostRow(
    boardId: string,
    postId: string,
    v: EditPostValues,
): Promise<Post | null> {
    if (!UUID_REGEX.test(postId)) return null;

    const patch: Record<string, unknown> = {
        title: v.title,
        content: v.content,
        category_id: v.category_id ?? null,
        is_secret: v.is_secret ?? false,
        updated_at: new Date().toISOString(),
    };
    if (v.thumbnail_url) patch.thumbnail_url = v.thumbnail_url;
    if (v.rating !== undefined) patch.rating = v.rating;

    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('posts')
        .update(patch)
        .eq('id', postId)
        .eq('board_id', boardId)
        .is('deleted_at', null)
        .select(POST_SELECT)
        .maybeSingle();

    if (error) throw new Error(`글 수정 실패: ${error.message}`);
    return data ? toPost(data as unknown as PostWithAnswerRow) : null;
}

// 소프트 삭제
export async function softDeletePostRow(
    boardId: string,
    postId: string,
): Promise<boolean> {
    if (!UUID_REGEX.test(postId)) return false;

    const now = new Date().toISOString();
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('posts')
        .update({ deleted_at: now, updated_at: now })
        .eq('id', postId)
        .eq('board_id', boardId)
        .is('deleted_at', null)
        .select('id');

    if (error) throw new Error(`글 삭제 실패: ${error.message}`);
    return (data ?? []).length > 0;
}

// 답변 저장
export async function saveAnswerRow(
    boardId: string,
    postId: string,
    content: string,
    answeredBy: string,
): Promise<boolean> {
    const post = await fetchPost(boardId, postId);
    if (!post) return false;

    const supabase = await createServerClient();
    if (post.answer) {
        const { error } = await supabase
            .from('post_answers')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('post_id', postId);
        if (error) throw new Error(`답변 수정 실패: ${error.message}`);
    } else {
        const { error } = await supabase
            .from('post_answers')
            .insert({ post_id: postId, content, answered_by: answeredBy });
        if (error) throw new Error(`답변 등록 실패: ${error.message}`);
    }
    return true;
}

// 조회수 증가 코드 (단순 방식으로 구현)
// - 두 사람이 동시에 열면 한 번이 사라질 수 있음 (지금 SQL 함수로 구현하는 건 능력밖...)
// - updated_at은 건들지 않음 (조회가 글 수정으로 보이면 안 됨)
export async function increaseViewCountRow(
    boardId: string,
    postId: string,
): Promise<void> {
    if (!UUID_REGEX.test(postId)) return;

    const supabase = await createServerClient();
    const { data, error: readError } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .eq('board_id', boardId)
        .is('deleted_at', null)
        .maybeSingle();

    if (readError) throw new Error(`조회수 조회 실패: ${readError.message}`);
    if (!data) return; // 글이 없으면 올릴 조회수가 없음

    const { error } = await supabase
        .from('posts')
        .update({ view_count: (data.view_count ?? 0) + 1 })
        .eq('id', postId);

    if (error) throw new Error(`조회수 증가 실패: ${error.message}`);
}
