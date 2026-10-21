export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(
        new Date(iso),
    );
}

export function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(iso));
}
