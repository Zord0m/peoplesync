// src/models/TimeEntry.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface TimeEntryAttributes {
  id        : number;
  employeeId: number;
  projectId : number;
  projectTag: string;          // <──  NOVO
  date      : string;          // yyyy-MM-dd
  start     : string;          // HH:mm
  end       : string;          // HH:mm
  duration? : number | null;
  description?: string | null;
  createdBy : string;
  updatedBy?: string | null;
}

type TimeEntryCreationAttributes = Optional<TimeEntryAttributes, "id" | "duration" | "description" | "updatedBy">;

class TimeEntry extends Model<TimeEntryAttributes, TimeEntryCreationAttributes>
  implements TimeEntryAttributes {

  public id!: number;
  public employeeId!: number;
  public projectId!: number;
  public projectTag!: string;        // <──  NOVO
  public date!: string;
  public start!: string;
  public end!: string;
  public duration!: number | null;
  public description!: string | null;
  public createdBy!: string;
  public updatedBy!: string | null;
}

TimeEntry.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    projectId : { type: DataTypes.INTEGER, allowNull: false },

    projectTag: { type: DataTypes.STRING, allowNull: false },   // <──  NOVO

    date : { type: DataTypes.STRING, allowNull: false },
    start: { type: DataTypes.STRING, allowNull: false },
    end  : { type: DataTypes.STRING, allowNull: false },

    duration: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },

    createdBy: { type: DataTypes.STRING, allowNull: false },
    updatedBy: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    modelName: "TimeEntry"
  }
);

export default TimeEntry;
export type { TimeEntryCreationAttributes };
