import { Router } from "express"
import { signup, signin, signout } from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verify.js";


const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);


export default router;
