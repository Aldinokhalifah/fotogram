import { AuthService } from "../services/authService";
import type { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../schema/authSchema";

export class AuthController {
    private authService = new AuthService();

    registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const parsed = RegisterSchema.safeParse(req.body);

            if (!parsed.success) {
                const message = parsed.error.issues[0]?.message ?? 'Data tidak valid';
                res.status(400).json({ status: 'error', message });
                return;
            }

            const response = await this.authService.registerUser(parsed.data);

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

    loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const parsed = LoginSchema.safeParse(req.body);

            if (!parsed.success) {
                const message = parsed.error.issues[0]?.message ?? 'Data tidak valid';
                res.status(400).json({ status: 'error', message });
                return;
            }

            const { email, password } = parsed.data;
            const token = await this.authService.loginUser(email, password);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000,
            });

            res.status(200).json({ status: 'success', message: 'Login berhasil'});
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ status: 'error', message: error.message });
            } else {
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    }

    logoutUser = async (req: Request, res: Response): Promise<void> => {
            try {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                })

                res.status(200).json({ status: 'success', message: 'Logout berhasil'});
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ status: 'error', message: error.message });
                } else {
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            }
    }
}