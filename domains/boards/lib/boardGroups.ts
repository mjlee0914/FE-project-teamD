import type { BoardGroup } from '../types/board.types';

// 랜딩 페이지로 묶이는 게시판 그룹 설정 (고객센터·커뮤니티 공통)
// - homeHref/homeLabel: 그룹에 속한 게시판 화면 위의 "← ○○ 홈" 링크
// - title: 있으면 그룹 화면의 제목(h1)을 이 값으로 통일, 없으면 각 게시판 이름을 그대로 보여 줌
//   (고객센터는 FAQ·Q&A 모두 "고객센터"로 통일, 커뮤니티는 자유게시판·룩북 이름을 유지)
export const BOARD_GROUPS: Record<
    BoardGroup,
    { homeHref: string; homeLabel: string; title?: string }
> = {
    support: {
        homeHref: '/boards/support',
        homeLabel: '← 고객센터 홈',
        title: '고객센터',
    },
    community: {
        homeHref: '/boards/community',
        homeLabel: '← 커뮤니티 홈',
    },
};
