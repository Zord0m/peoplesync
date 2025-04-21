import TimeRecord from "../models/TimeRecord";
import Employee from "../models/Employee";

const ORDER = ['entry1', 'exit1', 'entry2', 'exit2', 'entry3', 'exit3'] as const;
type TimeType = typeof ORDER[number];

interface MarkTimeInput {
  employeeId: number;
  timeType: TimeType;
  timestamp?: string;
}

/**
 * Registra a batida de ponto para o funcionário logado
 *  • valida ordem       (exit1 só depois de entry1 …)
 *  • evita sobrescrita  (409 se campo já existe)
 *  • usa hora do servidor se timestamp não for enviado
 */
export const markTime = async ({ employeeId, timeType, timestamp }: MarkTimeInput) => {
  const todayIso = new Date().toISOString().split('T')[0];          // YYYY-MM-DD
  const todayBr  = todayIso.split('-').reverse().join('/');         // DD/MM/AAAA

  let record = await TimeRecord.findOne({ where: { employeeId, date: todayIso } });
  if (!record) {
    record = await TimeRecord.create({ employeeId, date: todayIso });
  }

  // 1) ordem
  const idx = ORDER.indexOf(timeType);
  if (idx > 0) {
    const prevField = ORDER[idx - 1] as keyof TimeRecord;
    if (!(record as any)[prevField]) {
      const error: any = new Error(`Você deve preencher ${prevField} antes de ${timeType}`);
      error.statusCode = 422;
      throw error;
    }
  }

  // 2) antissobrescrita
  if ((record as any)[timeType]) {
    const error: any = new Error(`Campo ${timeType} já preenchido`);
    error.statusCode = 409;
    throw error;
  }

  // 3) horário do servidor se vazio
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  (record as any)[timeType] = timestamp ?? `${hh}:${mm}:${ss}`;
  await record.save();

  // devolve data no formato DD/MM/AAAA para a UI
  const json = record.toJSON() as any;
  json.date = todayBr;
  return json;
};

/* ---------- ajuste manual (admin) ---------- */

interface ManualTimeInput {
  register: string;
  date: string; 
  [key: string]: any;
}

export const markTimeManual = async ({ register, date, ...fields }: ManualTimeInput) => {
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) throw new Error("Funcionário não encontrado");

  // converte DD/MM/AAAA → YYYY-MM-DD
  const [d, m, y] = date.split('/');
  const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

  let record = await TimeRecord.findOne({ where: { employeeId: employee.id, date: isoDate } });
  if (!record) record = await TimeRecord.create({ employeeId: employee.id, date: isoDate });

  Object.entries(fields).forEach(([k, v]) => { (record as any)[k] = v; });
  await record.save();

  const json = record.toJSON() as any;
  json.date = date;                
  return json;
};
