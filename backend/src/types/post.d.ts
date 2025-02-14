import { Types } from "mongoose";

interface IComments {
  text: string;
  user: Types.ObjectId;
}

export interface IPost {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  text?: String;
  img?: String;
  likes: Array<Types.ObjectId>;
  comments: Array<IComments>;
  createdAt: Date;
  updatedAt: Date;
}
