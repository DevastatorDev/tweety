import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/signup").post(asyncHandler(registerUser));
router.route("/login").post(asyncHandler(loginUser));
router.route("/logout").get(auth, asyncHandler(logoutUser));

router.route("/me").get(auth, getMe);

export default router;
