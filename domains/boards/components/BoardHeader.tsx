// 상태나 이벤트 없이 받은 데이터를 화면에 그리기만 합니다. (use client 불필요)

import type { BoardSetting } from '../types/board.types';
import GroupHomeLink from './GroupHomeLink';

interface BoardHeaderProps {
    board: BoardSetting;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
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
