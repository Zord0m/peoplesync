import bcrypt from 'bcryptjs';
import Employee from '../models/Employee';

export const createAdminUser = async () => {
  try {
    // Verifica se o admin já existe
    const adminExists = await Employee.findOne({ where: { type: "admin" } });

    if (!adminExists) {
      // Criação do usuário admin com dados padrão
      const hashedPassword = await bcrypt.hash('Senha123', 10); // Defina uma senha padrão e a criptografe
      const adminUser = await Employee.create({
        name: "Admin",
        email: "admin@empresa.com", // Ajuste conforme necessário
        role: "Admin",
        contractType: "clt",
        register: "123456", // Registro padrão
        type: "admin",
        password: hashedPassword,
        pcd: false,
        birthDate: "1990-01-01", // Ajuste a data conforme necessário
        gender: "masculino", // Ajuste conforme necessário
        isActive: true,
      });

      console.log('👑 Usuário admin criado com sucesso:', adminUser);
    } else {
      console.log('👑 Usuário admin já existe.');
    }
  } catch (error) {
    console.error('❌ Erro ao criar o usuário admin:', error);
  }
};
