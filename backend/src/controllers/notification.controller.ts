import { Request, Response } from "express";
import { Notification } from "../models/notification.model";

const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId }).populate({
    path: "from",
    select: "username profileImg",
  });

  await Notification.updateMany(
    { to: userId },
    {
      read: true,
    }
  );

  res.status(200).json(notifications);
};

const deleteNotifications = async (req: Request, res: Response) => {
  const userId = req.user._id;

  await Notification.deleteMany({ to: userId });

  res.status(200).json({ msg: "Notification deleted successfully" });
};

export { getNotifications, deleteNotifications };
