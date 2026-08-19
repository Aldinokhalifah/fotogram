import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { CreateUploadUrlInput, FileResponse, FileStatus } from "@/types/File";

export const fileService = {
    uploadFile: (data: CreateUploadUrlInput): Promise<ApiResponse<{ uploadUrl: string; fileId: string }>> =>
        apiClient<{ uploadUrl: string; fileId: string }>('/files/uploads', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    confirmUpload: (fileId: string, status: FileStatus): Promise<ApiResponse<FileResponse>> =>
        apiClient<FileResponse>(`/files/${fileId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),
    getFiles: ({limit, offset}: {limit: number, offset: number}): Promise<ApiResponse<FileResponse[]>> =>
        apiClient<FileResponse[]>(`/files?limit=${limit}&offset=${offset}`),
    deleteFile: (fileId: string): Promise<ApiResponse<boolean>> =>
        apiClient<boolean>(`/files/${fileId}`, {
            method: 'DELETE',
        }),
}