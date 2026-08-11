import { UserService } from "../services/userService";
import type { Request, Response } from "express";

export class UserController {
    private userService = new UserService();

    findUsername = async (req: Request, res: Response): Promise<void> => {
        try {
            
        } catch (error) {
            
        }
    }
}