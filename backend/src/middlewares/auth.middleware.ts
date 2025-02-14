import { Request, Response, NextFunction } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { User } from "../models/user.model.js";
import { IUser } from "../types/user.js";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user.toObject();
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
