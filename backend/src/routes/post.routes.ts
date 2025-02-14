import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createPost } from "../controllers/post.controller";

const router = Router();

router.route("/create").post(auth, createPost);

export default router;
