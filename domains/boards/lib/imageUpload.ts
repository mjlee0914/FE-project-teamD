// 서버 액션 본문이 1MB로 제한되어 있어서 감안해서 개발 (실제 업로드 시 제약 불필요)
export const MAX_IMAGE_BYTES = 800 * 1024;

// 새로 고른 파일이 있으면 File, 없으면 null, 파일 안 고르면 size 0
export function pickImage(formData: FormData): File | null {
    const file = formData.get('image');
    return file instanceof File && file.size > 0 ? file : null;
}

export async function toDataUrl(file: File): Promise<string> {
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

// 섬네일 URL 표시용 (데이터 URL은 그대로)
export function toImageSrc(url?: string | null): string | undefined {
    return url?.replace(/^public\//, '/');
}
