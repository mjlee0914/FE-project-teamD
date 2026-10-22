// 이미지 크기 제한 값은 브라우저(PostForm)와 함께 쓰려고 imageLimits.ts로 분리함 (여기서는 기존 import 경로 유지용으로 다시 내보냄)
export { MAX_IMAGE_BYTES } from './imageLimits';

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
