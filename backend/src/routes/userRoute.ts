import { Router } from "express";
import { UserController } from "../controllers/userController";
import auth from "../middleware/auth";
import { FileController } from "../controllers/FileController";

const router = Router();
const userController = new UserController();
const fileController = new FileController();

router.get("/", auth, userController.searchUser);
router.get("/me", auth, userController.getMe);
router.get("/:id", auth, userController.getUserById);
router.get("/:id/files", auth, fileController.listPublicFiles);
router.patch("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

export default router;
