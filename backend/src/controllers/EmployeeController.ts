import { Request, Response } from "express";
import { createEmployee, getEmployee, setPasswordByRegister, updateEmployee, updatePassword } from "../services/EmployeeService";
import Employee, { EmployeeCreationAttributes } from "../models/Employee";
import bcrypt from "bcryptjs";

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
 *               - pcd
 *               - birthDate
 *               - gender
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
 *               pcd:
 *                type: string
 *                enum: [sim, nao]
 *               birthDate:
 *                type: string
 *                pattern: '^\\d{2}/\\m{2}/\\a{4}$'
 *               gender:
 *                type: string
 *                enum: [masculino, feminino, outros]
 * 
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

//Ver funcionários

/**
 * @swagger
 * /employees/{register}:
 *   get:
 *     summary: Obtém informações de um funcionário pelo registro
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - in: path
 *         name: register
 *         required: true
 *         schema:
 *           type: string
 *         description: Matrícula do funcionário
 *     responses:
 *       200:
 *         description: Dados do funcionário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Funcionário não encontrado
 */


//Editar funcionário

/**
 * @swagger
 * /employees/{register}:
 *   put:
 *     summary: Atualiza informações de um funcionário
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - in: path
 *         name: register
 *         required: true
 *         schema:
 *           type: string
 *         description: Matrícula do funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               type:
 *                 type: string
 *                 enum: [comum, admin]
 *                 example: comum
 *               pcd:
 *                 type: string
 *                 enum: [sim, nao]
 *                 example: nao  
 *                birthDate:
 *                 type: string
 *                 pattern: '^\\d{2}/\\m{2}/\\a{4}$'
 *                 example: 01/01/2000 
 *               gender:
 *                 type: string
 *                 enum: [masculino, feminino, outros]
 *                 example: masculino           
 *     responses:
 *       200:
 *         description: Funcionário atualizado com sucesso
 *       400:
 *         description: Erro de validação ou funcionário não encontrado
 */


//Funcionário trocar a senha

/**
 * @swagger
 * /employees/{register}/password:
 *   put:
 *     summary: Permite que o próprio funcionário edite sua senha
 *     tags:
 *       - Funcionários
 *     parameters:
 *       - in: path
 *         name: register
 *         required: true
 *         schema:
 *           type: string
 *         description: Matrícula do funcionário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: SenhaAtual123
 *               newPassword:
 *                 type: string
 *                 example: NovaSenha123
 *               confirmPassword:
 *                 type: string
 *                 example: NovaSenha123
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Erro de validação ou senha incorreta
 */

// Ver funcionário
export const getEmployeeHandler = async (req: Request, res: Response) => {
  try {
    const { register } = req.params;
    const employee = await getEmployee(register);
    res.status(200).json(employee);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Editar funcionário
export const updateEmployeeHandler = async (req: Request, res: Response) => {
  try {
    const { register } = req.params;
    const result = await updateEmployee(register, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


// Editar senha
export const updatePasswordHandler = async (req: Request, res: Response) => {
  try {
    const { register } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const result = await updatePassword(register, currentPassword, newPassword, confirmPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
