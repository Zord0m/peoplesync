import { Request, Response } from "express";
import { loginService } from "../services/AuthService";

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - register
 *               - password
 *             properties:
 *               register:
 *                 type: string
 *                 example: 117276
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_aqui"
 *       400:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno no servidor
 */
export const loginEmployee = async (req: Request, res: Response) => {
  const { register, password } = req.body;

  try {
    const token = await loginService({ register, password });
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
