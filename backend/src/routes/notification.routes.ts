import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  getNotifications,
  deleteNotifications,
} from "../controllers/notification.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.route("/").get(auth, asyncHandler(getNotifications));
router.route("/").delete(auth, asyncHandler(deleteNotifications));

export default router;
