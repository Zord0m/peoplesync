import { Request, Response } from "express";
import { markTime, markTimeManual } from "../services/TimeRecordService";

/**
 * @swagger
 * /time-record:
 *   post:
 *     summary: Registra entrada/saída do funcionário logado
 *     tags: [Registro de Ponto]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [timeType]            
 *             properties:
 *               timeType:
 *                 type: string
 *                 enum: [entry1, exit1, entry2, exit2, entry3, exit3]
 *               timestamp:
 *                 type: string
 *                 description: Horário HH:mm:ss (opcional – servidor usa horário atual se omitido)
 *     responses:
 *       200: { description: Ponto registrado com sucesso }
 *       409: { description: Campo já preenchido }
 *       422: { description: Ordem inválida }
 */
export const registerTime = async (req: Request, res: Response) => {
  try {
    const employeeId = req.user!.id;               
    const { timeType, timestamp } = req.body;

    const record = await markTime({ employeeId, timeType, timestamp });
    res.json(record);
  } catch (err: any) {
    const status = err.statusCode ?? 400;
    res.status(status).json({ error: err.message });
  }
};

/**
 * @swagger
 * /time-record/admin:
 *   post:
 *     summary: Ajuste manual de ponto (somente RH/Admin)
 *     tags: [Registro de Ponto]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [register, date]
 *             properties:
 *               register: { type: string, example: "123456" }
 *               date:     { type: string, example: "06/04/2025", description: "DD/MM/AAAA" }
 *               entry1:   { type: string, example: "" }
 *               exit1:    { type: string, example: "" }
 *     responses:
 *       200: { description: Ajuste realizado }
 */
export const registerTimeAdmin = async (req: Request, res: Response) => {
  try {
    const record = await markTimeManual(req.body);
    res.json(record);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
