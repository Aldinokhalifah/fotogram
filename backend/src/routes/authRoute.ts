import { AuthController } from "../controllers/authController";
import { Router } from "express";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;
