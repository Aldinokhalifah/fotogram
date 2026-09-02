import { db } from "../config/db";
import type { CreateFileInput, File, FileStatus } from "../types/File";

export class FileRepository {
    async createFile(file: CreateFileInput): Promise<File> {
        const query = `
        INSERT INTO files (user_id, path_file, name_file, type, size_byte, status, caption)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, path_file, name_file, type, size_byte, uploaded_at, status, caption`;

        const result = await db.query(query, [
            file.user_id,
            file.path_file,
            file.name_file,
            file.type,
            file.size_byte,
            file.status,
            file.caption
        ])

        return result.rows[0]
    }

    async updateStatus(status: FileStatus, id: string): Promise<File | undefined> {
        const query = `
        UPDATE files SET status = $1 WHERE id = $2
        RETURNING id, user_id, path_file, name_file, type, size_byte, uploaded_at, status`;

        const result = await db.query(query, [
            status,
            id
        ])

        return result.rows[0]
    }

    async findAllByUserId(user_id: string, limit: number, offset: number): Promise<File[]> {
        const query = `
        SELECT id, user_id, path_file, name_file, type, size_byte, uploaded_at, status, caption FROM files
        WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT $2 OFFSET $3`;

        const result = await db.query(query, [
            user_id,
            limit,
            offset
        ])

        return result.rows as File[]
    }

    async findPublicFilesByUserId(userId: string, limit: number, offset: number): Promise<File[]> {
        const query = `
        SELECT id, user_id, path_file, name_file, type, size_byte, uploaded_at, status, caption FROM files
        WHERE user_id = $1 AND status = 'completed' ORDER BY uploaded_at DESC LIMIT $2 OFFSET $3`;

        const result = await db.query(query, [
            userId,
            limit,
            offset
        ])

        return result.rows as File[]
    }

    async findById(id: string): Promise<File| undefined> {
        const query = `
        SELECT id, user_id, path_file, name_file, type, size_byte, uploaded_at, status, caption FROM files
        WHERE id = $1`;

        const result = await db.query(query, [
            id,
        ])

        return result.rows[0]
    }

    async deleteFile(id: string): Promise<boolean> {
        const query = `DELETE FROM files WHERE id = $1`;

        const result = await db.query(query, [
            id,
        ])

        return  (result.rowCount ?? 0) > 0
    }
}