import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  getNotifications,
  deleteNotifications,
} from "../controllers/notification.controller";

const router = Router();

router.route("/").get(auth, getNotifications);
router.route("/").delete(auth, deleteNotifications);

export default router;
