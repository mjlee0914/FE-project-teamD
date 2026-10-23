import 'server-only';

import { createServerClient } from '@/lib/supabase';

// DB 이미지가 없는 경우 사용할 기본 이미지
export const DEFAULT_PRODUCT_IMAGE = '/products/clothing-placeholder.svg';

// 여러 상품의 이미지를 한 번에 조회
export async function getProductImageUrls(
    gids: Array<number | string | null | undefined>,
): Promise<Map<string, string>> {
    const imageUrls = new Map<string, string>();

    // 중복된 파일 그룹 ID 제거
    const validGids = [
        ...new Set(
            gids.flatMap((gid) => {
                if (typeof gid === 'number' && !Number.isSafeInteger(gid))
                    return [];
                const value = gid == null ? '' : String(gid);
                return /^[1-9]\d*$/.test(value) ? [value] : [];
            }),
        ),
    ];

    if (validGids.length === 0) {
        return imageUrls;
    }

    const supabase = await createServerClient();

    // 1. 파일 그룹 조회
    const { data: groups, error: groupError } = await supabase
        .from('file_group')
        .select('id::text, info_id::text')
        .in('id', validGids);

    if (groupError) {
        console.error('상품 이미지 그룹 조회 실패:', groupError.message);
        return imageUrls;
    }

    // 2. 파일 정보 ID 추출
    const infoIds = [
        ...new Set(
            (groups ?? []).flatMap((group) =>
                group.info_id == null ? [] : [group.info_id],
            ),
        ),
    ];

    if (infoIds.length === 0) {
        return imageUrls;
    }

    // 3. 실제 이미지 정보 조회
    const { data: files, error: fileError } = await supabase
        .from('file_info')
        .select('id::text, url, original_name, content_type, seq')
        .in('id', infoIds)
        .eq('location', 'product_main')
        .order('seq', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true });

    if (fileError) {
        console.error('상품 이미지 조회 실패:', fileError.message);
        return imageUrls;
    }

    const images = (files ?? []).filter(
        (file) =>
            typeof file.url === 'string' &&
            file.url.length > 0 &&
            (file.content_type?.startsWith('image/') ||
                /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(
                    file.original_name ?? '',
                )),
    );

    // 기존 외부 URL은 유지하고, 업로드한 내부 경로만 일괄 서명합니다.
    const paths = [
        ...new Set(
            images.flatMap((file) =>
                /^https?:\/\//i.test(file.url) ? [] : [file.url],
            ),
        ),
    ];
    const signedUrls = new Map<string, string>();

    if (paths.length > 0) {
        const { data: signedFiles, error: signingError } =
            await supabase.storage
                .from('attachments')
                .createSignedUrls(paths, 60 * 60);

        if (signingError) {
            console.error('상품 이미지 URL 생성 실패:', signingError.message);
        } else {
            for (const file of signedFiles ?? []) {
                if (!file.error && file.path && file.signedUrl) {
                    signedUrls.set(file.path, file.signedUrl);
                }
            }
        }
    }

    // 4. 각 파일 그룹에 정렬 순서상 첫 번째 표시 가능한 이미지 연결
    for (const file of images) {
        const url = /^https?:\/\//i.test(file.url)
            ? file.url
            : signedUrls.get(file.url);

        if (!url) continue;

        for (const group of groups ?? []) {
            if (group.info_id === file.id && !imageUrls.has(group.id)) {
                imageUrls.set(group.id, url);
            }
        }
    }

    return imageUrls;
}
