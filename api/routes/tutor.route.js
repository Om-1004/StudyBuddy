import { Router } from "express";
import { createTutorProfile } from "../controllers/tutor.controller.js";

const router = Router();

router.post("/tutorProfile", createTutorProfile);

export default router;
