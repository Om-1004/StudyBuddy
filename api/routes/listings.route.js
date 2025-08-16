import { Router } from "express"
import { filterUsers } from "../controllers/listings.controller.js";

const router = Router();
router.get("/getListings", filterUsers);

export default router;
