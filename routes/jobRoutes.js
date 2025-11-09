import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import { createJob, getJobs, updateJob, deleteJob, getStats } from "../controllers/jobController.js";


const router = Router();
router.use(requireAuth);
router.get("/stats", getStats);
router.post("/", createJob);
router.get("/", getJobs);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;