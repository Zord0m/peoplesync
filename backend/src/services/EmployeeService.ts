import Employee from "../models/Employee";
import bcrypt from "bcryptjs";

interface EmployeeInput {
  name: string;
  email: string;
  role: string;
  contractType: "clt" | "pj" | "estagio";
  register: string;
  password: string;
}

export const createEmployee = async (data: EmployeeInput) => {
  // Validações básicas (exemplo - pode ser separado em outro módulo futuramente)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!emailRegex.test(data.email)) {
    throw new Error("Email inválido");
  }

  if (!passwordRegex.test(data.password)) {
    throw new Error("A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.");
  }

  if (!["clt", "pj", "estagio"].includes(data.contractType)) {
    throw new Error("Tipo de contratação inválido.");
  }

  if (!/^[0-9]{6}$/.test(data.register)) {
    throw new Error("Matrícula deve conter exatamente 6 números.");
  }

  // Verifica se email já existe
  const exists = await Employee.findOne({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email já cadastrado.");
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newEmployee = await Employee.create({
    ...data,
    password: hashedPassword
  });

  return newEmployee;
};
