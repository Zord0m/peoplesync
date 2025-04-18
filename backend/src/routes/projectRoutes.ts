import { Router } from 'express';
import { createProject } from '../controllers/projectController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// Ordem: autentica, verifica admin, executa controller
router.post('/', authMiddleware, isAdmin, createProject);

export default router;
