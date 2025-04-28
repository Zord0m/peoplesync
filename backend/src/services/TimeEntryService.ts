import TimeEntry  from "../models/TimeEntry";
import Project    from "../models/Project";
import Employee   from "../models/Employee";
import { Op }     from "sequelize";
import {
  parse, format, isBefore, differenceInMinutes
} from "date-fns";

/* ---------- DTOs ---------- */
export interface CreateEntryDTO {
  employeeId : number;
  projectTag : string;
  date       : string;  // "dd/MM/yyyy"
  start      : string;  // "HH:mm"
  end        : string;  // "HH:mm"
  description?: string;
}

interface UpdateEntryDTO extends Partial<Omit<CreateEntryDTO, "employeeId" | "projectTag">> {
  entryId    : number;
  employeeId : number;
}

/* ---------- CREATE ---------- */
export const createTimeEntry = async (data: CreateEntryDTO) => {
  const day   = parse(data.date,  "dd/MM/yyyy", new Date());
  const start = parse(`${data.date} ${data.start}`, "dd/MM/yyyy HH:mm", new Date());
  const end   = parse(`${data.date} ${data.end}`  , "dd/MM/yyyy HH:mm", new Date());

  if (!isBefore(start, end))
    throw new Error("Horário de início deve ser antes do término.");

  /* projeto ativo */
  const project = await Project.findOne({ where: { tag: data.projectTag, status: "active" }});
  if (!project) throw new Error("Projeto não encontrado ou inativo.");

  /* sobreposição */
  const overlap = await TimeEntry.findOne({
    where: {
      employeeId: data.employeeId,
      date      : format(day, "yyyy-MM-dd"),
      [Op.or]: [
        { start: { [Op.between]: [data.start, data.end] } },
        { end  : { [Op.between]: [data.start, data.end] } },
        { [Op.and]: [
            { start: { [Op.lte]: data.start } },
            { end  : { [Op.gte]: data.end  } }
        ]}
      ]
    }
  });
  if (overlap) throw new Error("Intervalo se sobrepõe a outro apontamento.");

  /* cria registro */
  const entry = await TimeEntry.create({
    employeeId : data.employeeId,
    projectId  : project.id,
    projectTag : data.projectTag,
    date       : format(day, "yyyy-MM-dd"),
    start      : data.start,
    end        : data.end,
    duration   : differenceInMinutes(end, start),
    description: data.description,
    createdBy  : data.employeeId.toString(),
    updatedBy  : data.employeeId.toString()
  });

  return entry;
};

/* ---------- UPDATE ---------- */
export const updateTimeEntry = async (dto: UpdateEntryDTO) => {
  const entry = await TimeEntry.findByPk(dto.entryId);
  if (!entry) throw new Error("Registro não encontrado");

  if (dto.date)  entry.date  = format(parse(dto.date, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");
  if (dto.start) entry.start = dto.start;
  if (dto.end)   entry.end   = dto.end;
  if (dto.description !== undefined) entry.description = dto.description;

  /* se alterou intervalo, recalcule duração */
  if (dto.start || dto.end) {
    const start = parse(`${format(parse(entry.date, "yyyy-MM-dd", new Date()),"dd/MM/yyyy")} ${entry.start}`, "dd/MM/yyyy HH:mm", new Date());
    const end   = parse(`${format(parse(entry.date, "yyyy-MM-dd", new Date()),"dd/MM/yyyy")} ${entry.end}`  , "dd/MM/yyyy HH:mm", new Date());
    if (!isBefore(start, end)) throw new Error("Horário inicial deve ser antes do final.");
    entry.duration = differenceInMinutes(end, start);
  }

  entry.updatedBy = dto.employeeId.toString();
  await entry.save();
  return entry;
};

/* ---------- LISTAR funcionário ---------- */
interface ListParams { employeeId: number; start: string; end: string; }

export const listEntries = async ({ employeeId, start, end }: ListParams) => {
  const dStart = format(parse(start, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");
  const dEnd   = format(parse(end  , "dd/MM/yyyy", new Date()), "yyyy-MM-dd");

  return TimeEntry.findAll({
    where : {
      employeeId,
      date: { [Op.between]: [dStart, dEnd] }
    },
    order: [["date","ASC"], ["start","ASC"]]
  });
};

/* ---------- LISTAR admin por matrícula ---------- */
export const listEntriesByRegister = async (register: string, start: string, end: string) => {
  const emp = await Employee.findOne({ where: { register } });
  if (!emp) throw new Error("Funcionário não encontrado.");
  return listEntries({ employeeId: emp.id, start, end });
};
