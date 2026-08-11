import { UserService } from "../services/userService";
import type { Request, Response } from "express";

export class UserController {
    private userService = new UserService();

    registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.body;

            if (!user || Object.keys(user).length === 0) {
                res.status(400).json({ status: 'error', message: 'Body user wajib diisi' });
                return;
            }

            const response = await this.userService.registerUser(user);

            res.status(201).json({
                status: 'success',
                message: 'User berhasil dibuat',
                data: response
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: 'error', message: error.message });
            } else {
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    }
}