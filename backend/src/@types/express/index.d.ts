import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        register: string;
        role: string;
      };
    }
  }
}
