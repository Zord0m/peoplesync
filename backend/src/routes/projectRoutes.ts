import { Router } from "express";
import { createProject } from "../controllers/projectController";

const router = Router();

// Rota para criar um novo projeto
router.post("/", createProject);

export default router;
