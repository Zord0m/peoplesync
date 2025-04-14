import TimeRecord from "../models/TimeRecord";

interface MarkTimeInput {
  employeeId: number;
  timeType: 'entry1' | 'exit1' | 'entry2' | 'exit2' | 'entry3' | 'exit3';
  timestamp: string; // formato HH:mm:ss
}

export const markTime = async ({ employeeId, timeType, timestamp }: MarkTimeInput) => {
  const today = new Date().toISOString().split('T')[0];

  let record = await TimeRecord.findOne({ where: { employeeId, date: today } });

  if (!record) {
    record = await TimeRecord.create({ employeeId, date: today });
  }

  (record as any)[timeType] = timestamp;
  await record.save();

  return record;
};

// ADMIN - Corrige ou insere os horários manualmente
interface ManualTimeInput {
    register: string;
    date: string;
    entry1?: string;
    exit1?: string;
    entry2?: string;
    exit2?: string;
    entry3?: string;
    exit3?: string;
  }
  
  import Employee from "../models/Employee";
  
  export const markTimeManual = async ({ register, date, ...rest }: ManualTimeInput) => {
    const employee = await Employee.findOne({ where: { register } });
    if (!employee) throw new Error("Funcionário não encontrado.");
  
    let record = await TimeRecord.findOne({ where: { employeeId: employee.id, date } });
  
    if (!record) {
      record = await TimeRecord.create({ employeeId: employee.id, date });
    }
  
    for (const key of Object.keys(rest)) {
      (record as any)[key] = (rest as any)[key];
    }
  
    await record.save();
    return record;
  };