'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '@/shared/utils/cn';
import type { StoredAttachment } from '@/domains/files/types/file.types';

export type ExistingAttachment = StoredAttachment;

export type AttachmentValue = {
    existingFiles: ExistingAttachment[];
    newFiles: File[];
    deletedIds: string[];
};

export type FileAttachmentProps = {
    value: AttachmentValue;
    onChange: (value: AttachmentValue) => void;
    accept?: Accept;
    /** 기존 파일과 새 파일을 합한 개수. 0 또는 생략하면 제한 없음. */
    maxFiles?: number;
    /** 파일 하나당 최대 바이트 수. */
    maxSize?: number;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
};

// 새로 선택한 이미지의 미리보기
function ImagePreview({ file }: { file: File }) {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        if (imageRef.current) imageRef.current.src = objectUrl;

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
        <img
            ref={imageRef}
            alt={file.name}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
    );
}

function FileIcon() {
    return (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <span aria-hidden="true">📄</span>
        </div>
    );
}

function formatSize(bytes: number) {
    return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 파일 선택과 표시만 담당합니다. 업로드·삭제·저장은 부모에서 처리합니다. */
export default function FileAttachment({
    value,
    onChange,
    accept,
    maxFiles = 0,
    maxSize,
    disabled = false,
    readOnly = false,
    className,
}: FileAttachmentProps) {
    const { existingFiles, newFiles: files, deletedIds } = value;
    const [errors, setErrors] = useState<string[]>([]);
    const errorId = useId();
    const locked = disabled || readOnly;
    const count = existingFiles.length + files.length;

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        maxSize,
        disabled: locked,
        onDrop: (acceptedFiles, rejections) => {
            if (locked) return;

            const messages = rejections.flatMap(({ file, errors }) =>
                errors.map((error) => {
                    const reason =
                        error.code === 'file-too-large' && maxSize !== undefined
                            ? `파일 크기는 ${formatSize(maxSize)} 이하여야 합니다.`
                            : error.code === 'file-invalid-type'
                              ? '허용되지 않는 파일 형식입니다.'
                              : error.message;
                    return `${file.name}: ${reason}`;
                }),
            );

            // 추가 선택할 때도 기존 파일을 포함한 전체 개수로 검사합니다.
            if (maxFiles > 0 && count + acceptedFiles.length > maxFiles) {
                setErrors([
                    ...messages,
                    `기존 파일을 포함해 최대 ${maxFiles}개까지 첨부할 수 있습니다.`,
                ]);
                return;
            }

            setErrors(messages);
            if (acceptedFiles.length > 0) {
                onChange({ ...value, newFiles: [...files, ...acceptedFiles] });
            }
        },
    });

    function removeExistingFile(id: string) {
        if (locked) return;
        onChange({
            ...value,
            existingFiles: existingFiles.filter((file) => file.id !== id),
            deletedIds: [...new Set([...deletedIds, id])],
        });
        setErrors([]);
    }

    function removeNewFile(index: number) {
        if (locked) return;
        onChange({ ...value, newFiles: files.filter((_, i) => i !== index) });
        setErrors([]);
    }

    return (
        <div className={cn('space-y-4', className)}>
            {!readOnly && (
                <div
                    {...getRootProps({
                        role: 'button',
                        'aria-label': '첨부파일 추가',
                        'aria-disabled': disabled,
                        'aria-describedby': errors.length ? errorId : undefined,
                    })}
                    className={cn(
                        'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    <input {...getInputProps()} />
                    <p>
                        {isDragActive
                            ? '파일을 여기에 놓아주세요.'
                            : '클릭하거나 파일을 끌어 놓으세요.'}
                    </p>
                    {(maxFiles > 0 || maxSize !== undefined) && (
                        <p className="mt-1 text-xs text-gray-500">
                            {[
                                maxFiles > 0
                                    ? `최대 ${maxFiles}개 (현재 ${count}개)`
                                    : null,
                                maxSize !== undefined
                                    ? `파일당 ${formatSize(maxSize)} 이하`
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(' / ')}
                        </p>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {/* 기존 첨부파일 */}
                {existingFiles.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                    >
                        {file.url && file.content_type?.startsWith('image/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={file.url}
                                alt={file.original_name}
                                className="h-16 w-16 shrink-0 rounded-lg object-cover"
                            />
                        ) : (
                            <FileIcon />
                        )}

                        <div className="min-w-0 flex-1">
                            {file.url ? (
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={file.original_name}
                                    className="block truncate text-sm underline"
                                >
                                    {file.original_name}
                                </a>
                            ) : (
                                <p
                                    className="truncate text-sm"
                                    title={file.original_name}
                                >
                                    {file.original_name}
                                </p>
                            )}
                            {file.file_size !== undefined && (
                                <p className="text-xs text-gray-500">
                                    {formatSize(file.file_size)}
                                </p>
                            )}
                        </div>

                        {!readOnly && (
                            <button
                                type="button"
                                disabled={disabled}
                                aria-label={`${file.original_name} 삭제`}
                                onClick={() => removeExistingFile(file.id)}
                                className="shrink-0 text-sm text-red-500"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                ))}

                {/* 새로 선택한 첨부파일 */}
                {files.map((file, index) => (
                    <div
                        key={`new-${index}`}
                        className="flex items-center gap-3 rounded-lg border p-3"
                    >
                        {file.type.startsWith('image/') ? (
                            <ImagePreview file={file} />
                        ) : (
                            <FileIcon />
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm" title={file.name}>
                                {file.name}
                            </p>
                            <span className="text-xs text-blue-500">
                                새 파일
                            </span>
                            <p className="text-xs text-gray-500">
                                {formatSize(file.size)}
                            </p>
                        </div>

                        {!readOnly && (
                            <button
                                type="button"
                                disabled={disabled}
                                aria-label={`${file.name} 삭제`}
                                onClick={() => removeNewFile(index)}
                                className="shrink-0 text-sm text-red-500"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {!readOnly && errors.length > 0 && (
                <ul
                    id={errorId}
                    role="alert"
                    className="space-y-1 text-sm text-red-500"
                >
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
