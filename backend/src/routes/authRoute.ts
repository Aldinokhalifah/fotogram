import { UserController } from "../controllers/userController";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.post("/register", userController.registerUser);

export default router;
