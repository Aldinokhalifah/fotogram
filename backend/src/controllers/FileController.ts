import { FileService } from "../services/fileService";
import type { Request, Response } from "express";

export class FileController {
    private fileService = new FileService();

    uploadFile = async(req: Request, res: Response): Promise<void> => {
        try {
            const { filename, fileType, fileSize } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (!filename || typeof filename !== "string" || filename.trim() === "") {
                res.status(400).json({ status: "error", message: "Nama file wajib diisi" });
                return;
            }

            if (!fileType || typeof fileType !== "string" || !fileType.includes("/")) {
                res.status(400).json({ status: "error", message: "Tipe file tidak valid" });
                return;
            }

            if (typeof fileSize !== "number" || Number.isNaN(fileSize) || fileSize <= 0) {
                res.status(400).json({ status: "error", message: "Ukuran file harus lebih dari 0" });
                return;
            }

            const file = await this.fileService.generateUploadUrl(userId, filename, fileType, fileSize);

            res.status(201).json({
                status: "success",
                message: "File berhasil diupload",
                data: file,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    confirmUpload = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const userId = req.user?.id;
            const status = req.body?.status;

            if (!userId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (!id || id.trim() === "") {
                res.status(400).json({ status: "error", message: "ID file wajib diisi" });
                return;
            }

            if (typeof status !== "string" || status.trim() === "") {
                res.status(400).json({ status: "error", message: "Status upload wajib diisi" });
                return;
            }

            const confirmed = await this.fileService.confirmUpload(id, userId, status);

            res.status(200).json({
                status: "success",
                message: "Status file sudah diperbarui",
                data: confirmed,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    listFiles = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const limit = Number(req.query.limit ?? 10);
            const offset = Number(req.query.offset ?? 0);

            if (!userId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (!Number.isFinite(limit) || limit <= 0) {
                res.status(400).json({ status: "error", message: "Limit harus berupa angka lebih dari 0" });
                return;
            }

            if (!Number.isFinite(offset) || offset < 0) {
                res.status(400).json({ status: "error", message: "Offset harus berupa angka lebih dari atau sama dengan 0" });
                return;
            }

            const files = await this.fileService.listUserFiles(userId, limit, offset);

            res.status(200).json({
                status: "success",
                message: "Semua file berhasil diambil",
                data: files,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    deleteFile = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (!id || id.trim() === "") {
                res.status(400).json({ status: "error", message: "ID file wajib diisi" });
                return;
            }

            const deleted = await this.fileService.deleteFile(id, userId);

            res.status(200).json({
                status: "success",
                message: "File berhasil dihapus",
                data: deleted,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }
}