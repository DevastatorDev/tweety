import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Notification } from "../models/notification.model";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  followOrUnfollowUserSchema,
  getUserProfileSchema,
  updateProfileSchema,
} from "../schemas/user.schema";

const getUserProfile = async (req: Request, res: Response) => {
  const result = getUserProfileSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json(result.error.issues[0]);
    return;
  }

  const { username } = req.params;

  const user = await User.findOne({
    username,
  }).select("-password");

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json(user);
  return;
};

const getSuggestedUsers = async (req: Request, res: Response) => {
  const userId = req.user._id;

  const usersFollowedByMe = await User.findById(userId).select("following");

  if (!usersFollowedByMe) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: userId,
        },
      },
    },
    {
      $sample: {
        size: 10,
      },
    },
  ]);

  if (users.length === 0) {
    res.status(200).json([]);
    return;
  }

  const filteredUsers = users.filter(
    (user) => !usersFollowedByMe.following.includes(user._id)
  );

  const suggestedUsers = filteredUsers.slice(0, 4);

  suggestedUsers.forEach((suggestedUser) => (suggestedUser.password = null));

  res.status(200).json(suggestedUsers);
  return;
};

const followOrUnfollowUser = async (req: Request, res: Response) => {
  const result = followOrUnfollowUserSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json(result.error.issues[0]);
    return;
  }

  const { id } = req.params;

  const userToFollowOrUnfollow = await User.findById(id);

  const currentUser = await User.findById(req.user._id);

  if (!userToFollowOrUnfollow || !currentUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (userToFollowOrUnfollow._id.toString() === currentUser._id.toString()) {
    res.status(400).json({ error: "You can't follow/unfollow yourself" });
    return;
  }

  const isFollowed = currentUser.following.includes(userToFollowOrUnfollow._id);

  if (isFollowed) {
    await User.updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          followers: req.user._id,
        },
      }
    );

    await User.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          following: id,
        },
      }
    );

    res.status(200).json({ msg: "You unfollow successfully" });
    return;
  } else {
    await User.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          followers: req.user._id,
        },
      }
    );

    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $push: {
          following: id,
        },
      }
    );

    await Notification.create({
      from: req.user._id,
      to: id,
      type: "follow",
    });
    res.status(200).json({ msg: "You follow successfully" });
    return;
  }
};

const updateProfile = async (req: Request, res: Response) => {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.issues[0]);
    return;
  }

  const { username, fullName, newPassword, currentPassword, email, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  let user = await User.findById(req.user._id);

  if (!user) {
    res.status(200).json({ error: "User not found" });
    return;
  }

  if (!(newPassword && currentPassword) || !(currentPassword && newPassword)) {
    res
      .status(400)
      .json({ error: "Please provide both current password and new password" });
    return;
  }

  if (newPassword && currentPassword) {
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
  }

  if (profileImg) {
    if (user.profileImg) {
      const imgId = user.profileImg.split("/").pop();
      if (!imgId || imgId.length === 0) {
        return;
      }
      await cloudinary.uploader.destroy(imgId.split(".")[0]);
    } else {
      const cldRes = await cloudinary.uploader.upload(profileImg);
      profileImg = cldRes.secure_url;
    }
  }

  if (coverImg) {
    if (user.coverImg) {
      const imgId = user.coverImg.split("/").pop();
      if (!imgId || imgId.length === 0) {
        return;
      }
      await cloudinary.uploader.destroy(imgId.split(".")[0]);
    } else {
      const cldRes = await cloudinary.uploader.upload(profileImg);
      coverImg = cldRes.secure_url;
    }
  }

  user.username = username || user.username;
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  await user.save();

  res.status(200).json(user);
  return;
};

export {
  getUserProfile,
  getSuggestedUsers,
  followOrUnfollowUser,
  updateProfile,
};
