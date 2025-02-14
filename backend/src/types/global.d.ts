import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user: Omit<IUser, "password">;
    }
  }
}
