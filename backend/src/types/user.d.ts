import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  fullName: string;
  password: string;
  email: string;
  followers: Array<Types.ObjectId>;
  following: Array<Types.ObjectId>;
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}
