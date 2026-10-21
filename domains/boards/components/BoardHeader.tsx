// 상태나 이벤트 없이 받은 데이터를 화면에 그리기만 합니다. (use client 불필요)

import type { BoardSetting } from '../types/board.types';
import { BOARD_GROUPS } from '../lib/boardGroups';
import GroupHomeLink from './GroupHomeLink';

interface BoardHeaderProps {
    board: BoardSetting;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
    // 그룹(고객센터·커뮤니티)에 속한 게시판이면 설정을 가져옴 (이전에는 board.id === 'faq' 같은 하드코딩)
    const group = board.group ? BOARD_GROUPS[board.group] : null;

    const boardTitle = board.name;

    return (
        // 보드헤더는 게시물이 아닌 게시판을 받습니다.
        <header className="mb-8 border-b pb-6">
            {board.group && <GroupHomeLink group={board.group} />}
            <p className="text-muted-foreground text-xs tracking-widest">
                {board.eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-bold">{boardTitle}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
                {board.description}
            </p>
        </header>
    );
}
