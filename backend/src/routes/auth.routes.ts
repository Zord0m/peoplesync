import { Router } from "express";
import { loginEmployee } from "../controllers/authcontrolers";

const router = Router();

// Rota de login
router.post("/login", loginEmployee);

export default router;
