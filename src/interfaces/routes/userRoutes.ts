import { Router } from "express";
import { uploads } from "../middlewares/multer";
import { userController } from "../controllers/UserController";

const router = Router();

router.post('/extract', uploads, userController.extractText);

export default router;