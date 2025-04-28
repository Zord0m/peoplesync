import { Request, Response } from "express";
import {
  createTimeEntry,
  updateTimeEntry,
  listEntries,
  listEntriesByRegister
} from "../services/TimeEntryService";

/* ──────────────────────────────────────────────────────────
   POST /time-entry   – funcionário registra horas
─────────────────────────────────────────────────────────── */
/**
 * @swagger
 * /time-entry:
 *   post:
 *     summary: Registra um novo apontamento de horas
 *     tags: [Ponto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectTag, date, start, end]
 *             properties:
 *               projectTag:
 *                 type: string
 *                 example: PSYNC-123
 *               date:
 *                 type: string
 *                 example: "06/04/2025"
 *               start:
 *                 type: string
 *                 example: "09:00"
 *               end:
 *                 type: string
 *                 example: "12:00"
 *               description:
 *                 type: string
 *                 example: Desenvolvimento da API
 *     responses:
 *       201:
 *         description: Apontamento criado
 *       400:
 *         description: Erro de validação
 */
export const postTimeEntry = async (req: Request, res: Response) => {
  try {
    const entry = await createTimeEntry({
      employeeId : req.user!.id,
      projectTag : req.body.projectTag,
      date       : req.body.date,
      start      : req.body.start,
      end        : req.body.end,
      description: req.body.description
    });
    res.status(201).json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────
   PATCH /time-entry/:id   – editar (dono ou admin)
─────────────────────────────────────────────────────────── */
/**
 * @swagger
 * /time-entry/{id}:
 *   patch:
 *     summary: Atualiza um apontamento existente
 *     tags: [Ponto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:      { type: string, example: "06/04/2025" }
 *               start:     { type: string, example: "13:00" }
 *               end:       { type: string, example: "15:30" }
 *               description:
 *                 type: string
 *                 example: Revisão de código
 *     responses:
 *       200: { description: Registro atualizado }
 *       400: { description: Erro de validação ou permissão }
 */
export const patchTimeEntry = async (req: Request, res: Response) => {
  try {
    const entry = await updateTimeEntry({
      entryId    : Number(req.params.id),
      employeeId : req.user!.id,
      ...req.body          // date, start, end, description
    });
    res.json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────
   GET /time-entry?start=dd/MM/yyyy&end=dd/MM/yyyy
   – lista do próprio funcionário
─────────────────────────────────────────────────────────── */
/**
 * @swagger
 * /time-entry:
 *   get:
 *     summary: Lista apontamentos do usuário logado em um intervalo
 *     tags: [Ponto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema: { type: string, example: "01/04/2025" }
 *       - in: query
 *         name: end
 *         required: true
 *         schema: { type: string, example: "30/04/2025" }
 *     responses:
 *       200: { description: Lista de apontamentos }
 *       400: { description: Parâmetros inválidos }
 */
export const getMyEntries = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as any;
    const rows = await listEntries({
      employeeId: req.user!.id,
      start,
      end
    });
    res.json(rows);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ──────────────────────────────────────────────────────────
   GET /time-entry/employee/{register}?start=…&end=…
   – admin / RH consulta de outro funcionário
─────────────────────────────────────────────────────────── */
/**
 * @swagger
 * /time-entry/employee/{register}:
 *   get:
 *     summary: Lista apontamentos de um funcionário pela matrícula (admin)
 *     tags: [Ponto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: register
 *         required: true
 *         schema: { type: string, example: "062741" }
 *       - in: query
 *         name: start
 *         required: true
 *         schema: { type: string, example: "01/04/2025" }
 *       - in: query
 *         name: end
 *         required: true
 *         schema: { type: string, example: "30/04/2025" }
 *     responses:
 *       200: { description: Lista de apontamentos }
 *       400: { description: Funcionário não encontrado / parâmetros inválidos }
 */
export const getEntriesByEmployee = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query as any;
    const rows = await listEntriesByRegister(req.params.register, start, end);
    res.json(rows);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
