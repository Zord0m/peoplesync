import { Request, Response } from "express";
import { markTime, markTimeManual } from "../services/TimeRecordService";

/**
 * @swagger
 * /timerecord:
 *   post:
 *     summary: Registra um horário de ponto (funcionário comum)
 *     tags: [Registro de Ponto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, timeType, timestamp]
 *             properties:
 *               employeeId:
 *                 type: integer
 *               timeType:
 *                 type: string
 *                 enum: [entry1, exit1, entry2, exit2, entry3, exit3]
 *               timestamp:
 *                 type: string
 *                 example: "08:00:00"
 *     responses:
 *       200:
 *         description: Ponto registrado com sucesso
 */
export const registerTime = async (req: Request, res: Response) => {
  try {
    const result = await markTime(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /timerecord/admin:
 *   post:
 *     summary: Corrige ou insere registros manuais de ponto (apenas RH/admin)
 *     tags: [Registro de Ponto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [register, date]
 *             properties:
 *               register:
 *                 type: string
 *                 example: "123456"
 *               date:
 *                 type: string
 *                 example: "2025-04-06"
 *               entry1:
 *                 type: string
 *                 example: "08:00:00"
 *               exit1:
 *                 type: string
 *                 example: "12:00:00"
 *     responses:
 *       200:
 *         description: Registro manual realizado com sucesso
 */
export const registerTimeAdmin = async (req: Request, res: Response) => {
  try {
    const result = await markTimeManual(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
