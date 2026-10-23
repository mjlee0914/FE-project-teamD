export type FileLocation =
    'profile' | 'product_main' | 'product_desc' | 'post_attach' | 'post_image';

export type StoredAttachment = {
    id: string;
    original_name: string;
    content_type: string | null;
    url?: string;
    file_size?: number;
};

export interface FileInfo {
    id: number;
    location: FileLocation;
    original_name: string;
    content_type: string;
    extension: string;
    file_size: number;
    done: boolean;
    seq?: number;
    created_at: string;
    url?: string;
}
