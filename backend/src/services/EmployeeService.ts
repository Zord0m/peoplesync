import Employee from "../models/Employee";
import bcrypt from "bcryptjs";
import { EmployeeCreationAttributes } from "../models/Employee"; 
import e from "express";

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
    throw new Error("Campo PCD deve ser true ou false.");
  }
  if (!["masculino", "feminino", "outro"].includes(data.gender)) {
    throw new Error("Sexo deve ser 'masculino', 'feminino' ou 'outro'.");
  }
  const [day, month, year] = data.birthDate.split('/').map(Number);
  const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
  
  if (!isValidDate) {
    throw new Error("Data inválida.");
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

//ver funcionário

export const getEmployee = async (register: string) => {
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }
  return employee;
};

//ver vários funcionários
export const getEmployees = async (limit: number, offset: number) => {
  const employees = await Employee.findAll({
    limit,
    offset,
    order: [['id', 'ASC']], // opcional, para manter uma ordem
  });
  return employees;
};

export const updateEmployee = async (register: string, data: Partial<EmployeeCreationAttributes>) => {
  // Encontra o funcionário com o registro fornecido
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  // Validação de campos opcionais, como o e-mail
  if (data.email) {
    const emailExists = await Employee.findOne({ where: { email: data.email } });
    if (emailExists) {
      throw new Error("Email já cadastrado.");
    }
  }

  // Remove campos com valor vazio ("") dos dados antes de atualizar
  Object.keys(data).forEach((key) => {
    if (data[key as keyof EmployeeCreationAttributes] === "") {
      delete data[key as keyof EmployeeCreationAttributes]; // Remove a chave
    }
  });

  // Atualiza apenas os campos que não foram removidos
  await employee.update(data);

  return employee;
};



export const updatePassword = async (register: string, currentPassword: string, newPassword: string, confirmPassword: string, authenticatedRegister: string) => {
  // Verifica se o funcionário está tentando alterar sua própria senha
  if (register !== authenticatedRegister) {
    throw new Error("Você não tem permissão para alterar a senha de outro funcionário.");
  }

  // Verifica se as senhas coincidem
  if (newPassword !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  // Regex para validação da senha
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número.");
  }

  // Busca o funcionário no banco
  const employee = await Employee.findOne({ where: { register } });
  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  // Verifica se a senha atual está correta
  const isPasswordCorrect = await bcrypt.compare(currentPassword, employee.password || "");
  if (!isPasswordCorrect) {
    throw new Error("Senha atual incorreta.");
  }

  // Criptografa a nova senha e a salva no banco
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  employee.password = hashedPassword;
  await employee.save();

  return { message: "Senha atualizada com sucesso." };
};

<<<<<<< HEAD
// Buscar funcionario comum 
export const getPublicCommonEmployee = async (register: string) => {
  const employee = await Employee.findOne({
    where: { register, type: "common" },
    attributes: ["name", "role", "register"]
  });

  if (!employee) return null;

  return {
    name: employee.name,
    role: employee.role,
    register: employee.register
  };
};
=======
//visualizar funcionário comum 
export const getPublicCommonEmployee = async (register: string) => {
  const employee = await Employee.findOne({ 
    where: { register, type:"comum" },
    attributes: ["name", "role", "register"]});

  if (!employee) return null;

  return{
    name: employee.name,
    role: employee.role,
    register: employee.register,
  };
};
>>>>>>> bd2d053ff93c3844b6f9cc7993de2d0215f4e81e
