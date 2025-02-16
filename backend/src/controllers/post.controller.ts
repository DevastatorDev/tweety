import { Request, Response } from "express";
import {
  commentOnPostSchema,
  createPostSchema,
  getUserPostsSchema,
  postIdSchema,
} from "../schemas/post.schema";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";

import { v2 as cloudinary } from "cloudinary";
import { Notification } from "../models/notification.model";

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "user",
      select: "-password",
    });

  if (posts.length === 0) {
    res.status(200).json([]);
    return;
  }

  res.status(200).json(posts);
  return;
};

const createPost = async (req: Request, res: Response) => {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  const { text } = result.data;
  let { img } = result.data;

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
  }

  if (img) {
    const cldRes = await cloudinary.uploader.upload(img);
    img = cldRes.secure_url;
  }

  const post = await Post.create({
    user: userId,
    text: text || "",
    img: img || "",
  });

  res.status(200).json(post);
  return;
};

const commentOnPost = async (req: Request, res: Response) => {
  const result = commentOnPostSchema.safeParse(req.body);

  const paramsResult = postIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  if (!paramsResult.success) {
    res.status(404).json(paramsResult.error.issues[0]);
    return;
  }

  const { id } = paramsResult.data;

  const { text } = result.data;

  const userId = req.user._id;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const comment = { text, user: userId };

  post.comments.push(comment);

  await post.save();

  res.status(200).json(post);
  return;
};

const deletePost = async (req: Request, res: Response) => {
  const result = postIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (post.user.toString() !== req.user._id.toString()) {
    res.status(400).json({ error: "You're not the owner of the post" });
    return;
  }

  if (post.img) {
    const imgId = post.img.split("/").pop();

    if (imgId && imgId.length > 0) {
      await cloudinary.uploader.destroy(imgId.split(".")[0]);
    }
  }

  await Post.findByIdAndDelete(id);

  res.status(200).json({ msg: "Post deleted successfully" });
  return;
};

const getUserPosts = async (req: Request, res: Response) => {
  const result = getUserPostsSchema.safeParse(req.params);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const posts = await Post.find({ user: user._id })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    });

  res.status(200).json(posts);
};

const likeOrUnlikePost = async (req: Request, res: Response) => {
  const result = postIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  const { id } = result.data;

  const userId = req.user._id;

  const postToLikeOrUnlike = await Post.findById(id);

  const likeOrUnlinkedBy = await User.findById(userId);

  if (!postToLikeOrUnlike) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (!likeOrUnlinkedBy) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const isLiked = likeOrUnlinkedBy.likedPosts.includes(postToLikeOrUnlike.id);

  if (isLiked) {
    await Post.updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          likes: userId,
        },
      }
    );

    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          likedPosts: id,
        },
      }
    );

    res.status(200).json({ msg: "Post unliked successfully" });
    return;
  } else {
    await Post.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          likes: userId,
        },
      }
    );

    await User.updateOne(
      {
        _id: userId,
      },
      {
        $push: {
          likedPosts: id,
        },
      }
    );
  }

  await Notification.create({
    from: userId,
    to: postToLikeOrUnlike.user,
    type: "like",
  });

  res.status(200).json({ msg: "Post liked successfully" });
  return;
};

const getLikedPosts = async (req: Request, res: Response) => {
  const result = postIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(404).json(result.error.issues[0]);
    return;
  }

  const { id } = result.data;

  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const likedPosts = await Post.find({
    _id: {
      $in: user.likedPosts,
    },
  })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    });

  res.status(200).json(likedPosts);
  return;
};

const getFollowingPosts = async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const followingPosts = await Post.find({
    user: {
      $in: user.following,
    },
  })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    });

  res.status(200).json(followingPosts);
  return;
};

export {
  getAllPosts,
  createPost,
  commentOnPost,
  deletePost,
  getUserPosts,
  likeOrUnlikePost,
  getLikedPosts,
  getFollowingPosts,
};
