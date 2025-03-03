// src/types/express.d.ts
declare namespace Express {
  interface Request {
    user: {
      _id: unknown;
      username: string;
    };
  }
}

