import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from '../config/database';
import TimeEntry from './TimeEntry';

/* ---------- Tipagens ---------- */
interface ProjectAttributes {
  id: number;
  name_project: string;
  tag: string;
  description: string;
  status: 'active' | 'inactive';
}
type ProjectCreationAttributes = Optional<ProjectAttributes, 'id'>;

/* ---------- Modelo ---------- */
class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public name_project!: string;
  public tag!: string;
  public description!: string;
  public status!: 'active' | 'inactive';

  static associations: {
    timeEntries: Association<Project, TimeEntry>;
  };

  static associate() {
    this.hasMany(TimeEntry, { foreignKey: 'projectId', as: 'timeEntries' });
  }
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_project: { type: DataTypes.STRING, allowNull: false },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // tag única para facilitar lookup
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  { sequelize, modelName: 'Project', tableName: 'Projects' }
);

export default Project;
export type { ProjectCreationAttributes };
