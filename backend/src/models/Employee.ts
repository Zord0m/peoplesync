import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Interface com os atributos do modelo
interface EmployeeAttributes {
  id: number;
  name: string;
  email: string;
  role: string;
  contractType: "clt" | "pj" | "estagio";
  register: string;
  type: "comum" | "admin";
  password?: string | null;
}

// Interface com os atributos necessários para criação (id e password são opcionais)
type EmployeeCreationAttributes = Optional<EmployeeAttributes, "id" | "password">;

// Classe modelada
class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public role!: string;
  public contractType!: "clt" | "pj" | "estagio";
  public register!: string;
  public type!: "comum" | "admin";
  public password?: string | null;
}

Employee.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contractType: {
    type: DataTypes.ENUM("clt", "pj", "estagio"),
    allowNull: false
  },
  register: {
    type: DataTypes.STRING(6),
    unique: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM("comum", "admin"),
    allowNull: false,
    defaultValue: "comum"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize,
  modelName: "Employee"
});

export default Employee;
export type { EmployeeCreationAttributes };
