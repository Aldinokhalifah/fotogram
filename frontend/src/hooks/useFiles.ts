'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { fileService } from '@/services/file';
import { CreateUploadUrlInput, FileStatus } from '@/types/File';
import toast from 'react-hot-toast';

export const fileQueryKeys = {
    all: ['files'] as const,
    list: (limit: number, offset: number) => ['files', { limit, offset }] as const,
};

export function useFiles(limit: number, offset: number) {
    return useQuery({
        queryKey: fileQueryKeys.list(limit, offset),
        queryFn: () => fileService.getFiles({ limit, offset }),
    });
}

export function useUploadFile() {
    return useMutation({
        mutationFn: (data: CreateUploadUrlInput) => fileService.uploadFile(data),
    });
}

export function useConfirmUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fileId, status }: { fileId: string; status: FileStatus }) =>
            fileService.confirmUpload(fileId, status),
        onSuccess: (_response) => {
            toast.success(_response.message);
            void queryClient.invalidateQueries({ queryKey: fileQueryKeys.all });
        }, 
        onError: (_error) => {
            toast.error(_error.message)
        }
    });
}

export function useDeleteFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fileId: string) => fileService.deleteFile(fileId),
        onSuccess: (_response) => {
            toast.success(_response.message);
            void queryClient.invalidateQueries({ queryKey: fileQueryKeys.all });
        }, 
        onError: (_error) => {
            toast.error(_error.message)
        }
    });
}