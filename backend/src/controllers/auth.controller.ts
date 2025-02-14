import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const registerUser = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  const { username, fullName, email, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ error: "Username is already taken" });
    return;
  }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    res.status(400).json({ error: "Email is already taken" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(200).json({ msg: "User signed up successfully" });
  return;
};

const loginUser = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.format());
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );

  if (!user || !isPasswordCorrect) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
    },
    JWT_SECRET
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV === "development" ? false : true,
    maxAge: 3600000,
    sameSite: "strict",
  });

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverImg,
  });
  return;
};

const logoutUser = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ msg: "User logout successfully" });
  return;
};

const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json(user);
  return;
};

export { registerUser, loginUser, logoutUser, getMe };
