import Employee from "../models/Employee";

export const createEmployee = async (data: Omit<Employee, "id">) => {
  // Validações
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    throw new Error("Email inválido");
  }

  if (!["clt", "pj", "estagio"].includes(data.contractType)) {
    throw new Error("Tipo de contratação inválido.");
  }

  if (!["comum", "admin"].includes(data.type)) {
    throw new Error("Tipo de funcionário inválido.");
  }

  if (!/^[0-9]{6}$/.test(data.register)) {
    throw new Error("Matrícula deve conter exatamente 6 números.");
  }

  const exists = await Employee.findOne({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email já cadastrado.");
  }

  const newEmployee = await Employee.create(data);
  return newEmployee;
};
