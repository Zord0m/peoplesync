import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Interface com os atributos do modelo
interface TimeRecordAttributes {
  id: number;
  employeeId: number;
  date: string; // formato YYYY-MM-DD
  entry1?: string;
  exit1?: string;
  entry2?: string;
  exit2?: string;
  entry3?: string;
  exit3?: string;
}

// Interface com os atributos necessários para criação (id e password são opcionais)
type TimeRecordCreationAttributes = Optional<TimeRecordAttributes, 'id'>;

// Classe modelada
class TimeRecord extends Model<TimeRecordAttributes, TimeRecordCreationAttributes> implements TimeRecordAttributes {
  public id!: number;
  public employeeId!: number;
  public date!: string;
  public entry1?: string;
  public exit1?: string;
  public entry2?: string;
  public exit2?: string;
  public entry3?: string;
  public exit3?: string;
}

TimeRecord.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entry1: DataTypes.STRING,
  exit1: DataTypes.STRING,
  entry2: DataTypes.STRING,
  exit2: DataTypes.STRING,
  entry3: DataTypes.STRING,
  exit3: DataTypes.STRING
}, {
  sequelize,
  modelName: 'TimeRecord',
});

export default TimeRecord;
