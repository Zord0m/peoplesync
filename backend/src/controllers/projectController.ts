import { Request, Response } from "express";
import { createProjectService } from "../services/ProjectsService";
import Project from "../models/Project";

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

//visualizar projeto

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista todos os projetos
 *     tags:
 *       - Projetos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


//Para atulizar o projeto

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Edita um projeto existente
 *     tags:
 *       - Projetos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_project:
 *                 type: string
 *               tag:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name_project, tag, description, status } = req.body;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }

    // Atualiza apenas os campos que foram preenchidos
    await project.update({
      name_project: name_project || project.name_project,
      tag: tag || project.tag,
      description: description || project.description,
      status: status || project.status,
    });

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


//excluir projeto

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Exclui um projeto
 *     tags:
 *       - Projetos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do projeto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projeto excluído com sucesso
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }

    await project.destroy();
    res.status(200).json({ message: "Projeto excluído com sucesso" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
