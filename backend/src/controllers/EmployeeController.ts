import { Request, Response } from "express";
import { createEmployee, getEmployee, getEmployees, setPasswordByRegister, updateEmployee, updatePassword } from "../services/EmployeeService";
import Employee, { EmployeeCreationAttributes } from "../models/Employee";

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
 *                 type: boolean
 *                 description: true = "sim", false = "não"
 *                 example: false
 *               birthDate:
 *                 type: string
 *                 pattern: '^\\d{2}/\\m{2}/\\a{4}$'
 *                 example: "01/01/2000"
 *               gender:
 *                 type: string
 *                 enum: [masculino, feminino, outro]
 *                 example: masculino
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

//Ver funcionário

/**
 * @swagger
 * /employees/{register}:
 *   get:
 *     summary: Obtém informações de um funcionário pelo registro
 *     tags: [Funcionários]
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Nome Sobrenome
 *                 email:
 *                   type: string
 *                   example: email@exemplo.com
 *                 role:
 *                   type: string
 *                   example: Cargo
 *                 contractType:
 *                   type: string
 *                   enum: [clt, pj, estagio]
 *                   example: clt
 *                 register:
 *                   type: string
 *                   example: "123456"
 *                 type:
 *                   type: string
 *                   enum: [comum, admin]
 *                   example: comum
 *                 pcd:
 *                   type: boolean
 *                   description: true = "sim", false = "não"
 *                   example: false
 *                 birthDate:
 *                   type: string
 *                   pattern: '^\\d{2}/\\d{2}/\\d{4}$'
 *                   example: "01/01/2000"
 *                 gender:
 *                   type: string
 *                   enum: [masculino, feminino, outro]
 *                   example: masculino
 *       400:
 *         description: Funcionário não encontrado
 */


// Ver vários funcionários
/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Obtém uma lista de funcionários
 *     tags: [Funcionários]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de funcionários para buscar (padrão 50)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset para paginação
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee' 
 *       400:
 *         description: Erro ao buscar funcionários
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
 *                 example: ""
 *               email:
 *                 type: string
 *                 example: ""
 *               role:
 *                 type: string
 *                 example: 
 *               contractType:
 *                 type: string
 *                 enum: [clt, pj, estagio]
 *                 example: ""
 *               type:
 *                 type: string
 *                 enum: [comum, admin]
 *                 example: ""
 *               pcd:
 *                 type: boolean
 *                 description: true = "sim", false = "não"
 *                 example: false
 *               birthDate:
 *                 type: string
 *                 pattern: '^\\d{2}/\\m{2}/\\a{4}$'
 *                 example: ""
 *               gender:
 *                 type: string
 *                 enum: [masculino, feminino, outro]
 *                 example: ""    
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

//ver vários funcionários por range

export const getEmployeesHandler = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50; // padrão 50 funcionários
    const offset = parseInt(req.query.offset as string) || 0; // para paginação (opcional)

    const employees = await getEmployees(limit, offset);
    res.status(200).json(employees);
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
export const updatePasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { register } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const authenticatedRegister = req.user?.register; // Supondo que o registro do usuário autenticado esteja em req.user

    if (!authenticatedRegister) {
      res.status(403).json({ error: 'Usuário não autenticado.' });
      return;
    }

    if (register !== authenticatedRegister) {
      res.status(403).json({ error: 'Você só pode atualizar a sua própria senha.' });
      return;
    }

    const result = await updatePassword(register, currentPassword, newPassword, confirmPassword, authenticatedRegister);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ativo ou inativo

export const deactivateEmployeeHandler = async (req: Request, res: Response) => {
  try {
    const { register } = req.params;

    const employee = await Employee.findOne({ where: { register } });
    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    employee.isActive = false;
    await employee.save();

    res.status(200).json({ message: 'Funcionário desativado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};