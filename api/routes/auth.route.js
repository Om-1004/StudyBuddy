import { Router } from "express"
import { signup, signin, signout } from "../controllers/auth.controller.js";
import { createTutorProfile } from "../controllers/tutor.controller.js";
import { verifyToken } from "../middleware/verify.js";

const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("signUpTutor", verifyToken, createTutorProfile);

export default router;
