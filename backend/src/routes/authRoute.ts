import { AuthController } from "../controllers/authController";
import { Router } from "express";
import auth from "../middleware/auth";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", auth, authController.logoutUser);

export default router;
