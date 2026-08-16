import { Router } from "express";
import { FileController } from "../controllers/FileController";
import auth from "../middleware/auth";

const router = Router();
const fileController = new FileController();

router.post("/uploads", auth, fileController.uploadFile);
router.patch("/:id/status", auth, fileController.confirmUpload);
router.get("/", auth, fileController.listFiles);
router.delete("/:id", auth, fileController.deleteFile);

export default router;
