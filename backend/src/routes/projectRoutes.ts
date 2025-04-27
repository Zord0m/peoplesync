import { Router } from 'express';
import { createProject, deleteProject, getProjects, updateProject } from '../controllers/projectController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { isActiveMiddleware } from '../middlewares/isActive';

const router = Router();

// Ordem: autentica, verifica admin, executa controller
router.post('/', authMiddleware, isAdmin, createProject);

// Visualizar todos os projetos
router.get("/", authMiddleware, getProjects);

// Editar um projeto
router.put("/:id", authMiddleware, isAdmin, updateProject);

// Excluir um projeto
router.delete("/:id", authMiddleware, isAdmin, deleteProject);

export default router;
