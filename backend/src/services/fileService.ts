import { randomUUID } from "crypto";
import * as path from "path";
import { FileRepository } from "../repositories/fileRepository";
import { minioClient } from "../config/minoClient";
import type { File, FileStatus } from "../types/File";

export class FileService {
    private fileRepo = new FileRepository();

    async generateUploadUrl(userId: string, filename: string, fileType: string, fileSize: number, caption?: string): Promise<{ uploadUrl: string; fileId: string }> {

        const objectKey = userId + '/' + (fileType.split('/')[0] === 'video' ? "videos" : "photos") + '/' + randomUUID() + path.extname(filename);

        const preUrl = await minioClient.presignedPutObject(process.env.BUCKET_NAME as string, objectKey, parseInt(process.env.EXPIRES_TIME as string));

        const createFile = await this.fileRepo.createFile({
            user_id: userId,
            path_file: objectKey,
            name_file: filename,
            type: fileType,
            size_byte: fileSize,
            status: 'pending',
            caption: caption
        });

        return { uploadUrl: preUrl, fileId: createFile.id as string };
    }

    async confirmUpload(fileId: string, userId: string, status: string): Promise<void> {
        const file = await this.fileRepo.findById(fileId);

        if (!file) {
            throw new Error("File tidak ditemukan");
        }

        if (file.user_id !== userId) {
            throw new Error("Kamu tidak memiliki akses untuk file ini!");
        }

        const normalizedStatus = status.trim().toLowerCase();
        const validStatuses: FileStatus[] = ["completed", "failed"];

        if (!validStatuses.includes(normalizedStatus as FileStatus)) {
            throw new Error("Status upload tidak valid");
        }

        const updatedFile = await this.fileRepo.updateStatus(normalizedStatus as FileStatus, fileId);

        if (!updatedFile) {
            throw new Error("Gagal memperbarui status file");
        }
    }

    async listUserFiles(userId: string, limit: number = 10, offset: number = 0): Promise<Array<File & { url: string }>> {
        const files = await this.fileRepo.findAllByUserId(userId, limit, offset);

        const filesWithUrl = await Promise.all(
            files.map(async (file) => {
                const url = await minioClient.presignedGetObject(process.env.BUCKET_NAME as string, file.path_file, Number(process.env.EXPIRES_TIME ?? 3600)
            );

            return {
                ...file,
                url
            };
            })
        );

        return filesWithUrl;
    }

    async listPublicFiles(userId: string, limit: number = 10, offset: number = 0): Promise<Array<File & { url: string }>> {
        const files = await this.fileRepo.findPublicFilesByUserId(userId, limit, offset);

        const filesWithUrl = await Promise.all(
            files.map(async (file) => {
                const url = await minioClient.presignedGetObject(process.env.BUCKET_NAME as string, file.path_file, Number(process.env.EXPIRES_TIME ?? 3600)
            );

            return {
                ...file,
                url
            };
            })
        );

        return filesWithUrl;
    }

    async deleteFile(fileId: string, userId: string): Promise<boolean> {
        const file = await this.fileRepo.findById(fileId);

        if (!file) {
            throw new Error("File tidak ditemukan");
        }

        if (file.user_id !== userId) {
            throw new Error("Kamu tidak memiliki akses untuk file ini!");
        }

        await minioClient.removeObject(process.env.BUCKET_NAME as string, file.path_file);

        const deletedDatabase = await this.fileRepo.deleteFile(fileId);

        if (!deletedDatabase) {
            throw new Error("Gagal menghapus file dari database");
        }

        return true;
    }
}