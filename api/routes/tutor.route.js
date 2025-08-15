import { Router } from "express";
import { createTutorProfile } from "../controllers/tutor.controller.js";
import { verifyToken } from "../middleware/verify.js";

const router = Router();

router.post("/tutorProfile", verifyToken, createTutorProfile);

export default router;
