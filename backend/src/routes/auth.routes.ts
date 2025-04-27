import { Router } from "express";
import { loginEmployee } from "../controllers/authcontrolers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Rota de login
router.post("/login", loginEmployee);

export default router;
