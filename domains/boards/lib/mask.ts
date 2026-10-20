// 작성자 이름 마스킹
export function maskName(name: string): string {
    const chars = [...name];
    if (chars.length <= 1) return '*';
    return chars[0] + '*'.repeat(chars.length - 1);
}

// 비밀글은 제목을 가림
export const SECRET_TITLE = '🔒 비밀글입니다.';
