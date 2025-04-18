import { Request, Response } from "express";
import { createProjectService } from "../services/ProjectsService";

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Realiza o cadastro de projetos
 *     tags:
 *       - Projetos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_project
 *               - tag
 *               - description
 *               - status
 *             properties:
 *               name_project:
 *                 type: string
 *                 example: Novo Sistema RH
 *               tag:
 *                 type: string
 *                 example: rh
 *               description:
 *                 type: string
 *                 example: Sistema para automatizar processos do RH
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name_project, tag, description, status } = req.body;

  try {
    const newProject = await createProjectService({
      name_project,
      tag,
      description,
      status,
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
