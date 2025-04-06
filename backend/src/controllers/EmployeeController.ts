import { Request, Response } from "express";
import { createEmployee, setPasswordByRegister } from "../services/EmployeeService";

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
 *               - type
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
 *               type:
 *                 type: string
 *                 enum: [comum, admin]
 *                 example: comum
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

/**
 * @swagger
 * /employees/set-password:
 *   post:
 *     summary: Define a senha do funcionário a partir da matrícula
 *     tags:
 *       - Funcionários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - register
 *               - password
 *               - confirmPassword
 *             properties:
 *               register:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: Senha123
 *               confirmPassword:
 *                 type: string
 *                 example: ConfirmeSenha123
 *     responses:
 *       200:
 *         description: Senha cadastrada com sucesso
 *       400:
 *         description: Erro de validação ou funcionário não encontrado
 */
export const setEmployeePassword = async (req: Request, res: Response) => {
  try {
    const { register, password, confirmPassword } = req.body;
    const result = await setPasswordByRegister(register, password, confirmPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
