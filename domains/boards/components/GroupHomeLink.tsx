import Link from 'next/link';
import type { BoardGroup } from '../types/board.types';
import { BOARD_GROUPS } from '../lib/boardGroups';

// 그룹 랜딩(고객센터 홈 / 커뮤니티 홈)으로 돌아가기
export default function GroupHomeLink({ group }: { group: BoardGroup }) {
    const { homeHref, homeLabel } = BOARD_GROUPS[group];

    return (
        <Link
            href={homeHref}
            className="text-muted-foreground mb-3 inline-block text-xs hover:text-black hover:underline"
        >
            {homeLabel}
        </Link>
    );
}
