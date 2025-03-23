import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Employee = sequelize.define("Employee", {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Employee;
