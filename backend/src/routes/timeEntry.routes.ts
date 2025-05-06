import { Router } from "express";
import {
  postTimeEntry,
  patchTimeEntry,
  getMyEntries,
  getEntriesByEmployee
} from "../controllers/TimeEntryController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin }       from "../middlewares/isAdmin";

const router = Router();

/* Criar apontamento */
router.post("/", authMiddleware, postTimeEntry);

/* Editar apontamento */
router.patch("/:id", authMiddleware, patchTimeEntry);

/* Listar do próprio usuário */
router.get("/", authMiddleware, getMyEntries);

/* Listar de outro funcionário (admin) */
router.get("/employee/:register", authMiddleware, isAdmin, getEntriesByEmployee);

export default router;
