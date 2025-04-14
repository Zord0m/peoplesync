import { Router } from "express";
import { registerTime, registerTimeAdmin } from "../controllers/TimeRecordController";
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, registerTime);           // Funcionário comum
router.post('/admin', authMiddleware, registerTimeAdmin); // Admin (RH)

export default router;
