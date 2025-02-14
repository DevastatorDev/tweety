import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeOrUnlikePost,
} from "../controllers/post.controller";

const router = Router();

router.route("/all").get(auth, getAllPosts);
router.route("/following").get(auth, getFollowingPosts);
router.route("/likes/:id").get(auth, getLikedPosts);
router.route("/user/:username").get(auth, getUserPosts);
router.route("/create").post(auth, createPost);
router.route("/like/:id").post(auth, likeOrUnlikePost);
router.route("/comment/:id").post(auth, commentOnPost);
router.route("/:id").delete(auth, deletePost);

export default router;
