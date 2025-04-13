import Project from "../models/Project";

interface CreateProjectInput {
  name_project: string;
  tag: string;
  description: string;
  status: "active" | "inactive";
}

export const createProjectService = async (data: CreateProjectInput) => {
  const { name_project, tag, description, status } = data;

  // Validação simples dos campos obrigatórios
  if (!name_project || !tag || !description || !status) {
    throw new Error("Todos os campos são obrigatórios");
  }

  // Validação do status
  if (status !== "active" && status !== "inactive") {
    throw new Error("O status deve ser 'active' ou 'inactive'");
  }

  // Criação do projeto no banco de dados
  const project = await Project.create({
    name_project,
    tag,
    description,
    status,
  });

  return project;
};
