import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee";

interface LoginInput {
  register: string;
  password: string;
}

export const loginService = async (data: LoginInput) => {
  const user = await Employee.findOne({ where: { register: data.register } });

  if (!user || !user.password) {
    throw new Error("Credenciais inválidas: Usuário ou senha não encontrados");
  }

  const passwordValid = await bcrypt.compare(data.password, user.password);
  if (!passwordValid) {
    throw new Error("Credenciais inválidas: Senha incorreta");
  }

  const token = jwt.sign(
    { id: user.id, register: user.register, type: user.type },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' }
  );

  return token;
};

