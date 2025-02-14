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
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.route("/all").get(auth, asyncHandler(getAllPosts));
router.route("/following").get(auth, asyncHandler(getFollowingPosts));
router.route("/likes/:id").get(auth, asyncHandler(getLikedPosts));
router.route("/user/:username").get(auth, asyncHandler(getUserPosts));
router.route("/create").post(auth, asyncHandler(createPost));
router.route("/like/:id").post(auth, asyncHandler(likeOrUnlikePost));
router.route("/comment/:id").post(auth, asyncHandler(commentOnPost));
router.route("/:id").delete(auth, asyncHandler(deletePost));

export default router;
