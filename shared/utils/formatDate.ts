export function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value || '—';

    // UTC 기준에 한국 시간(+9시간)을 반영
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const pad = (number: number) => String(number).padStart(2, '0');

    const year = koreaDate.getUTCFullYear();
    const month = pad(koreaDate.getUTCMonth() + 1);
    const day = pad(koreaDate.getUTCDate());
    const hour = pad(koreaDate.getUTCHours());
    const minute = pad(koreaDate.getUTCMinutes());

    return `${year}-${month}-${day} ${hour}:${minute}`;
}
