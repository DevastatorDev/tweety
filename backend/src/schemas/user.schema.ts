import { z } from "zod";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  usernameSchema,
} from "./common.schema";

export const getUserProfileSchema = z.object({
  username: usernameSchema,
});

export const followOrUnfollowUserSchema = z.object({
  id: z.string().length(24, "Invalid user id"),
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  fullName: fullNameSchema.optional(),
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  email: emailSchema.optional(),
  profileImg: z.string().optional(),
  coverImg: z.string().optional(),
  bio: z.string().optional(),
  link: z.string().optional(),
});
