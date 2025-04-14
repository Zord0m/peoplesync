import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Interface com os atributos do modelo
interface ProjectAttributes {
  id: number;
  name_project: string;
  tag: string;
  description: string;
  status: "active" | "inactive";
}

// Interface para criação (id é opcional)
type ProjectCreationAttributes = Optional<ProjectAttributes, "id">;

// Classe modelada
class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public name_project!: string;
  public tag!: string;
  public description!: string;
  public status!: "active" | "inactive";
}

// Definição do modelo
Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name_project: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active"
  }
}, {
  sequelize,
  modelName: "Project"
});

export default Project;
export type { ProjectCreationAttributes };
