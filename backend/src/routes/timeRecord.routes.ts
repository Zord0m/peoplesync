import { Router } from "express";
import { registerTime, registerTimeAdmin } from "../controllers/TimeRecordController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.post('/', authMiddleware, registerTime);// Funcionário comum
router.post('/admin', authMiddleware, isAdmin, registerTimeAdmin); // Admin (RH)

export default router;
