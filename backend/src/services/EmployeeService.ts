import Employee from "../models/Employee";
import bcrypt from "bcryptjs";
import { EmployeeCreationAttributes } from "../models/Employee"; 

export const createEmployee = async (data: EmployeeCreationAttributes) => {
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
  if (![true, false].includes(data.pcd)) {
    throw new Error("Campo PCD deve ser 'sim' ou 'nao'.");
  }
  if (!["masculino", "feminino", "outros"].includes(data.gender)) {
    throw new Error("Sexo deve ser 'masculino', 'feminino' ou 'outros'.");
  }
  if (!/^\d{2}\/\m{2}\/\a{4}$/.test(data.birthDate)) {
    throw new Error("Formato de data inválido. Use dd/mm/aaaa.");
  }
  
  const exists = await Employee.findOne({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email já cadastrado.");
  }

  const newEmployee = await Employee.create(data);
  return newEmployee;
};

export const setPasswordByRegister = async (register: string, password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número.");
  }

  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  employee.password = hashedPassword;
  await employee.save();

  return { message: "Senha cadastrada com sucesso." };
};

export const getEmployee = async (register: string) => {
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }
  return employee;
};

export const updateEmployee = async (register: string, data: Partial<EmployeeCreationAttributes>) => {
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  // Validação de campos opcionais, se desejar, como contrato e tipo de funcionário
  if (data.email) {
    const emailExists = await Employee.findOne({ where: { email: data.email } });
    if (emailExists) {
      throw new Error("Email já cadastrado.");
    }
  }

  // Atualiza apenas os campos que foram passados
  await employee.update(data);

  return employee;
};

export const updatePassword = async (register: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
  if (newPassword !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número.");
  }

  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, employee.password || "");
  if (!isPasswordCorrect) {
    throw new Error("Senha atual incorreta.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  employee.password = hashedPassword;
  await employee.save();

  return { message: "Senha atualizada com sucesso." };
};
