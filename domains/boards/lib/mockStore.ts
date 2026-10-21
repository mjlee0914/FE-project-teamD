import { BOARD_SETTINGS } from '../mocks/settings';
import { BOARD_CATEGORY_ROWS } from '../mocks/categories';
import { POSTS, EVENT_POSTS } from '../mocks/posts';
import type {
    BoardSetting,
    BoardCategoryRow,
    Post,
} from '../types/board.types';

type Store = {
    boards: BoardSetting[];
    categories: BoardCategoryRow[];
    posts: Post[];
};
const g = globalThis as unknown as { __boardStore?: Store };

// 시드 데이터 복사 후 재사용(임시)
// 나중에 글 추가해도 목데이터 변경 없도록 클론
export const store: Store = (g.__boardStore ??= {
    boards: structuredClone(BOARD_SETTINGS),
    posts: structuredClone([...POSTS, ...EVENT_POSTS]),
    categories: structuredClone(BOARD_CATEGORY_ROWS),
});
