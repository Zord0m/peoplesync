import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee";

interface LoginInput {
  register: string;
  password: string;
  isActive: boolean;
}

export const loginService = async (data: LoginInput) => {
  // 1. Verifica se o usuário existe com o número de registro fornecido
  const user = await Employee.findOne({ where: { register: data.register } });

  if (!user || !user.password) {
    throw new Error("Credenciais inválidas: Usuário ou senha não encontrados");
  }

  // 2. Verifica se a senha está correta
  const passwordValid = await bcrypt.compare(data.password, user.password);
  if (!passwordValid) {
    throw new Error("Credenciais inválidas: Senha incorreta");
  }

  // 3. Verifica se o usuário está ativo
  if (user.isActive !== true) {
    throw new Error("Seu usuário está inativo. Acesso negado.");
  }

  // 4. Gera o token JWT
  const token = jwt.sign(
    { id: user.id, register: user.register, type: user.type },
    process.env.JWT_SECRET || 'defaultsecret', // Use uma chave secreta segura
    { expiresIn: '1h' }
  );

  return token;
};
