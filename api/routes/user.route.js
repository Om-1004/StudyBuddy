import express from "express";
import { verifyToken } from "../middleware/verify.js";
import { LookUp } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/lookup", verifyToken, LookUp);

export default router;