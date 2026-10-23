type SaveAttachmentsInput = {
    gid: string;
    newFiles: File[];
    deletedIds: string[];
};

type SaveAttachmentsResult = {
    gid: string;
    uploadedIds: string[];
};
