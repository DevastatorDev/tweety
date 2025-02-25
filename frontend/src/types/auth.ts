export interface IAuthUser {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  followers: Array<string>;
  following: Array<string>;
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  likedPosts: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
