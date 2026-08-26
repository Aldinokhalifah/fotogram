import { UserService } from "../services/userService";
import type { PublicUserProfile, UpdateUserInput, User } from "../types/User";
import type { Request, Response } from "express";

export class UserController {
    private userService = new UserService();

    private sanitizePrivateUser(user: User) {
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    private sanitizePublicUser(user: User): PublicUserProfile {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            created_at: user.created_at,
        };
    }

    private sanitizePublicUsers(users?: User[]): PublicUserProfile[] {
        return (users ?? []).map(user => this.sanitizePublicUser(user));
    }

    getMe = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            const user = await this.userService.getUserById(userId);
            if (!user) {
                res.status(404).json({ status: "error", message: "User tidak ditemukan" });
                return;
            }

            res.status(200).json({
                status: "success",
                message: "Berhasil mengambil data user",
                data: this.sanitizePrivateUser(user),
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!id) {
                res.status(400).json({ status: "error", message: "ID user wajib diisi" });
                return;
            }

            const user = await this.userService.getUserById(id);

            if (!user) {
                res.status(404).json({ status: "error", message: "User tidak ditemukan" });
                return;
            }

            res.status(200).json({
                status: "success",
                message: "Berhasil mengambil data user",
                data: this.sanitizePublicUser(user),
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    };

    searchUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const keyword = req.query?.search
            const limit = req.query?.limit || 10

            if (!keyword) {
                res.status(400).json({ status: "error", message: "Keyword wajib diisi!" });
                return;
            }

            const users = await this.userService.searchUsers(keyword as string, parseInt(limit as string));

            res.status(200).json({
                status: "success",
                message: "Berhasil mengambil data users",
                data: this.sanitizePublicUsers(users),
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const currentUserId = req.user?.id;

            if (!id) {
                res.status(400).json({ status: "error", message: "ID user wajib diisi" });
                return;
            }

            if (!currentUserId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (currentUserId !== id) {
                res.status(403).json({ status: "error", message: "Anda tidak memiliki akses untuk mengubah user ini" });
                return;
            }

            const { name, email, username, password } = req.body;
            const payload: UpdateUserInput = {};

            if (name !== undefined) payload.name = name;
            if (email !== undefined) payload.email = email;
            if (username !== undefined) payload.username = username;
            if (password !== undefined) payload.password = password;

            if (Object.keys(payload).length === 0) {
                res.status(400).json({ status: "error", message: "Minimal satu field harus diubah" });
                return;
            }

            const updatedUser = await this.userService.updateUser(id, payload);
            const safeUser = updatedUser ? this.sanitizePrivateUser(updatedUser) : undefined;

            res.status(200).json({
                status: "success",
                message: "User berhasil diperbarui",
                data: safeUser,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const currentUserId = req.user?.id;

            if (!id) {
                res.status(400).json({ status: "error", message: "ID user wajib diisi" });
                return;
            }

            if (!currentUserId) {
                res.status(401).json({ status: "error", message: "Token tidak valid" });
                return;
            }

            if (currentUserId !== id) {
                res.status(403).json({ status: "error", message: "Anda tidak memiliki akses untuk menghapus user ini" });
                return;
            }

            const deleted = await this.userService.deleteUser(id);
            if (!deleted) {
                res.status(404).json({ status: "error", message: "User tidak ditemukan" });
                return;
            }

            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            res.status(200).json({
                status: "success",
                message: "User berhasil dihapus",
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: "error", message: error.message });
                return;
            }

            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    };
}