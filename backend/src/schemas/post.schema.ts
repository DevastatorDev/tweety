import { z } from "zod";
import { idSchema, usernameSchema } from "./common.schema";

const createPostSchema = z.object({
  text: z.string(),
  img: z.string().optional(),
});

const postIdSchema = z.object({
  id: idSchema,
});

const commentOnPostSchema = z.object({
  text: z.string(),
});

const getUserPostsSchema = z.object({
  username: usernameSchema,
});

export {
  createPostSchema,
  postIdSchema,
  commentOnPostSchema,
  getUserPostsSchema,
};
