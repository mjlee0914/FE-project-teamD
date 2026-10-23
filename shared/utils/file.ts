import 'server-only';

import { createServerClient } from '@/lib/supabase';
import type {
    FileLocation,
    StoredAttachment,
} from '@/domains/files/types/file.types';

export async function getAttachments(
    gid: string,
    location: FileLocation,
): Promise<StoredAttachment[]> {
    if (!/^[1-9]\d*$/.test(gid)) {
        throw new Error('잘못된 파일 그룹 번호입니다.');
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('file_info')
        .select(
            'id::text, original_name, content_type, file_size, url, file_group!inner(id)',
        )
        .eq('file_group.id', gid)
        .eq('location', location)
        .order('seq', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true });

    if (error) throw error;
    if (!data?.length) return [];

    const paths = [
        ...new Set(
            data
                .map((file) => file.url)
                .filter(
                    (path): path is string =>
                        typeof path === 'string' && path.length > 0,
                ),
        ),
    ];
    const urls = new Map<string, string>();

    if (paths.length > 0) {
        // DB에는 내부 경로를 유지하고 조회할 때만 한 시간짜리 URL을 생성합니다.
        const { data: signedFiles, error: signedError } = await supabase.storage
            .from('attachments')
            .createSignedUrls(paths, 60 * 60);

        if (signedError) throw signedError;
        for (const file of signedFiles ?? []) {
            if (file.error || !file.path || !file.signedUrl) {
                throw new Error('첨부파일 이미지 주소를 생성하지 못했습니다.');
            }
            urls.set(file.path, file.signedUrl);
        }
        if (urls.size !== paths.length) {
            throw new Error('일부 첨부파일 이미지 주소를 생성하지 못했습니다.');
        }
    }

    return data.map((file) => ({
        id: file.id,
        original_name: file.original_name ?? '첨부파일',
        content_type: file.content_type,
        file_size: file.file_size ?? undefined,
        url: file.url ? urls.get(file.url) : undefined,
    }));
}

type SaveAttachmentsInput = {
    gid?: string; // int8은 JS에서 정밀도 손실을 피하려고 문자열로 전달
    location: FileLocation;
    newFiles: File[];
    deletedIds?: string[];
};

export async function saveAttachments({
    gid,
    location,
    newFiles,
    deletedIds = [],
}: SaveAttachmentsInput): Promise<string | undefined> {
    const supabase = await createServerClient();
    const bucket = 'attachments';

    if (gid !== undefined && !/^[1-9]\d*$/.test(gid)) {
        throw new Error('잘못된 파일 그룹 번호입니다.');
    }
    if (!deletedIds.every((id) => /^[1-9]\d*$/.test(id))) {
        throw new Error('잘못된 삭제 파일 번호입니다.');
    }
    if (gid === undefined && deletedIds.length > 0) {
        throw new Error('삭제할 파일의 그룹 번호가 필요합니다.');
    }

    // 업로드 시작 전에 파일 검증
    for (const file of newFiles) {
        if (file.size === 0) {
            throw new Error(`${file.name}: 빈 파일입니다.`);
        }
    }

    let groupId = gid;
    let nextSeq = 0;

    // 기존 그룹이면 마지막 정렬 번호 다음부터 추가
    if (groupId !== undefined && newFiles.length > 0) {
        const { data, error } = await supabase
            .from('file_info')
            .select('seq, file_group!inner(id)')
            .eq('file_group.id', groupId)
            .eq('location', location)
            .order('seq', {
                ascending: false,
                nullsFirst: false,
            })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        nextSeq = (data?.seq ?? -1) + 1;
    }

    // 이번 호출에서 저장한 파일만 기록
    const uploadedPaths: string[] = [];
    const insertedIds: string[] = [];

    try {
        for (const file of newFiles) {
            // 첫 파일은 아직 gid가 없으므로 경로에 gid를 사용하지 않음
            const path = crypto.randomUUID();

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    contentType: file.type || 'application/octet-stream',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            uploadedPaths.push(path);

            const dotIndex = file.name.lastIndexOf('.');

            const { data, error: insertError } = await supabase
                .from('file_info')
                .insert({
                    location,
                    original_name: file.name,
                    content_type: file.type || 'application/octet-stream',
                    extension:
                        dotIndex > 0
                            ? file.name.slice(dotIndex + 1).toLowerCase()
                            : '',
                    file_size: file.size,
                    done: true,
                    seq: nextSeq,
                    created_at: new Date().toISOString(),
                    url: path,
                })
                .select('id::text')
                .single();

            if (insertError) throw insertError;

            insertedIds.push(data.id);

            // 그룹의 첫 연결 행만 id를 생략해 시퀀스로 발급합니다.
            const { data: group, error: groupError } = await supabase
                .from('file_group')
                .insert({
                    ...(groupId !== undefined ? { id: groupId } : {}),
                    info_id: data.id,
                })
                .select('id::text')
                .single();

            if (groupError) throw groupError;

            groupId = group.id;
            nextSeq += 1;
        }
    } catch (error) {
        // 이번 호출에서 추가한 연결 → 파일 정보 → Storage 순서로 정리합니다.
        // DB 정리에 실패하면 아직 참조될 수 있는 Storage 파일은 남깁니다.
        let cleanupFailed = false;
        if (insertedIds.length > 0) {
            if (groupId !== undefined) {
                const { error: linkError } = await supabase
                    .from('file_group')
                    .delete()
                    .eq('id', groupId)
                    .in('info_id', insertedIds);

                if (linkError) {
                    cleanupFailed = true;
                    console.error('파일 그룹 정리 실패:', linkError);
                }
            }

            if (!cleanupFailed) {
                const { error: infoError } = await supabase
                    .from('file_info')
                    .delete()
                    .in('id', insertedIds);

                if (infoError) {
                    cleanupFailed = true;
                    console.error('파일 정보 정리 실패:', infoError);
                }
            }
        }

        if (!cleanupFailed && uploadedPaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from(bucket)
                .remove(uploadedPaths);

            if (storageError) console.error('Storage 정리 실패:', storageError);
        }
        throw error;
    }

    // 새 파일 저장이 완료된 다음 기존 파일 삭제
    if (groupId !== undefined && deletedIds.length > 0) {
        const { data: targets, error: lookupError } = await supabase
            .from('file_info')
            .select('id::text, url, file_group!inner(id)')
            .eq('file_group.id', groupId)
            .eq('location', location)
            .in('id', deletedIds);

        if (lookupError) throw lookupError;

        if (!targets?.length) return groupId;

        const targetIds = targets.map((file) => file.id);

        // 같은 파일을 다른 그룹에서도 쓰면 연결만 해제하고 파일은 보존합니다.
        const { data: otherLinks, error: referenceError } = await supabase
            .from('file_group')
            .select('info_id::text')
            .neq('id', groupId)
            .in('info_id', targetIds);

        if (referenceError) throw referenceError;

        const sharedIds = new Set(
            (otherLinks ?? []).map((link) => link.info_id),
        );
        const removable = targets.filter((file) => !sharedIds.has(file.id));

        const { error: unlinkError } = await supabase
            .from('file_group')
            .delete()
            .eq('id', groupId)
            .in('info_id', targetIds);

        if (unlinkError) throw unlinkError;

        const paths = removable
            .map((file) => file.url)
            .filter(
                (path): path is string =>
                    typeof path === 'string' && path.length > 0,
            );

        if (paths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from(bucket)
                .remove(paths);

            if (storageError) throw storageError;
        }

        if (removable.length > 0) {
            const { error: deleteError } = await supabase
                .from('file_info')
                .delete()
                .eq('location', location)
                .in(
                    'id',
                    removable.map((file) => file.id),
                );

            if (deleteError) throw deleteError;
        }
    }

    // 신규 파일이 없고 기존 gid도 없으면 undefined
    return groupId;
}
