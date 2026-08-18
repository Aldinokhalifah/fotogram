export type FileStatus = 'pending' | 'completed' | 'failed';

export interface FileResponse {
    id?: string;
    user_id: string;
    path_file: string;
    name_file: string;
    type: string;
    size_byte: number;
    uploaded_at?: string; // ISO date string from backend
    status: FileStatus;
    caption?: string;
    url?: string; // presigned URL provided by backend when listing
}

// Inputs sent from frontend to backend
export interface CreateUploadUrlInput {
    filename: string;
    fileType: string;
    fileSize: number;
    caption?: string;
}

export interface ConfirmUploadInput {
    status: 'completed' | 'failed';
}