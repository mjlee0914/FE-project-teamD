export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(
        new Date(iso),
    );
}
