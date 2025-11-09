import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getMe, updateMe } from "../controllers/userController.js";

const router = Router();
router.use(requireAuth);
router.get("/me", getMe);
router.put("/me", updateMe);

export default router;
