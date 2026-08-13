import { Router } from "express";
import { UserController } from "../controllers/userController";
import auth from "../middleware/auth";

const router = Router();
const userController = new UserController();

router.get("/me", auth, userController.getMe);
router.get("/:id", auth, userController.getUserById);
router.patch("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

export default router;
