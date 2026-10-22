import { createServerClient } from '@/lib/supabase';

// DB 이미지가 없는 경우 사용할 기본 이미지
export const DEFAULT_PRODUCT_IMAGE = '/products/clothing-placeholder.svg';

// 여러 상품의 이미지를 한 번에 조회
export async function getProductImageUrls(
    gids: Array<number | null | undefined>,
): Promise<Map<number, string>> {
    const imageUrls = new Map<number, string>();

    // 중복된 파일 그룹 ID 제거
    const validGids = [
        ...new Set(
            gids.filter(
                (gid): gid is number =>
                    typeof gid === 'number' && Number.isInteger(gid),
            ),
        ),
    ];

    if (validGids.length === 0) {
        return imageUrls;
    }

    const supabase = createServerClient();

    // 1. 파일 그룹 조회
    const { data: groups, error: groupError } = await supabase
        .from('file_group')
        .select('id, info_id')
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
        .select('id, url, original_name, seq')
        .in('id', infoIds)
        .order('seq', { ascending: true });

    if (fileError) {
        console.error('상품 이미지 조회 실패:', fileError.message);
        return imageUrls;
    }

    // 4. 각 파일 그룹에 첫 번째 유효한 이미지 연결
    for (const file of files ?? []) {
        if (
            typeof file.url !== 'string' ||
            !/^https?:\/\//i.test(file.url) ||
            !/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(file.original_name ?? '')
        ) {
            continue;
        }

        for (const group of groups ?? []) {
            if (group.info_id === file.id && !imageUrls.has(group.id)) {
                imageUrls.set(group.id, file.url);
            }
        }
    }

    return imageUrls;
}
