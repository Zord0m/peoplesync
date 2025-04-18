// types/express/index.d.ts

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        register: string;
        type: string;
      };
    }
  }
}

export {};
