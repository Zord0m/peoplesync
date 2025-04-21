import { Router } from "express";
import { registerTime, registerTimeAdmin } from "../controllers/TimeRecordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", authMiddleware, registerTime);                 // funcionário
router.post("/admin", authMiddleware, isAdmin, registerTimeAdmin); // RH/Admin

export default router;
