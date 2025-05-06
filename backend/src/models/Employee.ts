import { DataTypes, Model, Optional, Association } from 'sequelize';
import { sequelize } from '../config/database';
import TimeEntry from './TimeEntry';

/* ---------- Tipagens ---------- */
interface EmployeeAttributes {
  id: number;
  name: string;
  email: string;
  role: string;
  contractType: 'clt' | 'pj' | 'estagio';
  register: string;
  type: 'comum' | 'admin';
  password?: string | null;
  pcd: boolean; 
  birthDate: string;
  gender: "masculino" | "feminino" | "outro";
  isActive: boolean;
}
type EmployeeCreationAttributes = Optional<EmployeeAttributes, 'id' | 'password'>;

/* ---------- Modelo ---------- */
class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public role!: string;
  public contractType!: 'clt' | 'pj' | 'estagio';
  public register!: string;
  public type!: 'comum' | 'admin';
  public password?: string | null;
  public pcd!: boolean;
  public birthDate!: string;
  public gender!: 'masculino' | 'feminino' | 'outro';
  public isActive!: boolean;

  /* Association helpers (opcional) */
  public static associations: {
    timeEntries: Association<Employee, TimeEntry>;
  };

  static associate() {
    this.hasMany(TimeEntry, { foreignKey: 'employeeId', as: 'timeEntries' });
  }
}

Employee.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    contractType: {
      type: DataTypes.ENUM('clt', 'pj', 'estagio'),
      allowNull: false,
    },
    register: { type: DataTypes.STRING(6), unique: true, allowNull: false },
    type: {
      type: DataTypes.ENUM('comum', 'admin'),
      allowNull: false,
      defaultValue: 'comum',
    },
    password: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    pcd: { type: DataTypes.BOOLEAN, allowNull: false },
    birthDate: { type: DataTypes.STRING, allowNull: false },
    gender: {
      type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
      allowNull: false,
      defaultValue: 'masculino',
    },
    isActive: {type: DataTypes.BOOLEAN, allowNull: false },
  },
  { sequelize, modelName: 'Employee', tableName: 'Employees' }
);

export default Employee;
export type { EmployeeCreationAttributes };
