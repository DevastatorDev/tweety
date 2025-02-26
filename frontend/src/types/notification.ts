import { IAuthUser } from "./auth";

export interface INotification {
  _id: string;
  from: IAuthUser;
  to: string;
  type: "like" | "follow";
  read: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
