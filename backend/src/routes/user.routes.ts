import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  followOrUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();

router.route("/profile/:username").get(auth, getUserProfile);
router.route("/suggested").get(auth, getSuggestedUsers);
router.route("/follow/:id").get(auth, followOrUnfollowUser);
router.route("/update").put(auth, updateProfile);

export default router;
