import Employee from "../models/Employee";
import bcrypt from "bcryptjs";
import { EmployeeCreationAttributes } from "../models/Employee"; // <- você pode exportar isso no model

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
