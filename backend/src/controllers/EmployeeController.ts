import { Request, Response } from "express";
import { createEmployee } from "../services/EmployeeService";

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Cadastra um novo funcionário
 *     tags:
 *       - Funcionários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - contractType
 *               - register
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nome Sobrenome
 *               email:
 *                 type: string
 *                 example: email@email.com
 *               role:
 *                 type: string
 *                 example: Cargo
 *               contractType:
 *                 type: string
 *                 enum: [clt, pj, estagio]
 *                 example: clt
 *               register:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: Senha123
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *       400:
 *         description: Erro de validação ou dados duplicados
 */
export const registerEmployee = async (req: Request, res: Response) => {
  try {
    const result = await createEmployee(req.body);
    res.status(201).json({ message: "Funcionário cadastrado com sucesso", data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
