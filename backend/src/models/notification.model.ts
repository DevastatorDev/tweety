import mongoose, { Schema } from "mongoose";
import { INotification } from "../types/notification";

const notificationSchema = new Schema<INotification>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },
    read: {
      type: String,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
