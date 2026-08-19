import { Router } from "express";
import { getMyResume, saveMyResume } from "../controllers/cv.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getMyResume);

router.put("/me", authMiddleware, saveMyResume);

export default router;
