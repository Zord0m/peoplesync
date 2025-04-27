import { Request, Response, NextFunction } from "express";

export const isActiveMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verifica se o usuário logado está ativo (isActive === 1)
    if (req.user?.isActive !== true) {
      // Envia a resposta de erro, sem retornar o Response
      res.status(403).json({ error: "Seu usuário está inativo. Acesso negado." });
      return; // Termina a execução do middleware
    }

    // Se o usuário estiver ativo, continua para o próximo middleware
    next();
  } catch (error: any) {
    // Em caso de erro no middleware, envia uma resposta de erro genérico
    res.status(500).json({ error: "Erro na verificação de atividade." });
  }
};
