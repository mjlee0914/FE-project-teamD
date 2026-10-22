import type { GalleryLayout, Post } from '../types/board.types';
import PostCard from './PostCard';

// 완성된 클래스 문자열을 통째로 전달 (조합하면 인식 안됨)
const LAYOUTS: Record<GalleryLayout, { aspect: string; columns: string }> = {
    portrait: {
        aspect: 'aspect-[3/4]',
        columns: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    },
    landscape: {
        aspect: 'aspect-[4/3]',
        columns: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    },
};

interface PostGalleryProps {
    boardId: string;
    posts: Post[];
    layout?: GalleryLayout;
    categories?: { id: string; name: string }[]; // 이벤트 종료 분류
    maskAuthor?: boolean; // 작성자 이름 가림
}

// 카드 그리드
export default function PostGallery({
    boardId,
    posts,
    layout = 'portrait',
    categories = [],
    maskAuthor,
}: PostGalleryProps) {
    if (posts.length === 0) {
        return (
            <p className="text-muted-foreground py-16 text-center text-sm">
                등록된 게시글이 없습니다.
            </p>
        );
    }
    const { aspect, columns } = LAYOUTS[layout];
    return (
        <div className={`grid gap-4 ${columns}`}>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    boardId={boardId}
                    post={post}
                    aspect={aspect}
                    maskAuthor={maskAuthor}
                    categoryName={
                        categories.find((c) => c.id === post.category_id)?.name
                    }
                />
            ))}
        </div>
    );
}
