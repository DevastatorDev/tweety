import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  followOrUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.route("/profile/:username").get(auth, asyncHandler(getUserProfile));
router.route("/suggested").get(auth, asyncHandler(getSuggestedUsers));
router.route("/follow/:id").get(auth, asyncHandler(followOrUnfollowUser));
router.route("/update").put(auth, asyncHandler(updateProfile));

export default router;
