import { Types } from "mongoose";

export interface INotification {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  type: "like" | "follow";
  read: Boolean;
}
