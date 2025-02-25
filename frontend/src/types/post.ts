import { IAuthUser } from "./auth";

interface IComments {
  _id: string;
  text: string;
  user: IAuthUser;
}

export interface IPost {
  _id: string;
  user: IAuthUser;
  text: string;
  img: string;
  likes: Array<string>;
  comments: Array<IComments> | undefined;
  creadetAt: Date;
  updatedAt: Date;
}
