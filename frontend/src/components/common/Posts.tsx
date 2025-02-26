import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useId } from "react";
import { IPost } from "../../types/post";

interface IFeed {
  feedType: string;
  username?: string;
  userId?: string;
}

const Posts = ({ feedType, username, userId }: IFeed) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "http://localhost:3000/api/v1/post/all";
      case "following":
        return "http://localhost:3000/api/v1/post/following";
      case "posts":
        return `http://localhost:3000/api/v1/post/user/${username}`;
      case "likes":
        return `http://localhost:3000/api/v1/post/likes/${userId}`;
      default:
        return "http://localhost:3000/api/v1/post/all";
    }
  };

  const POST_ENDPOINT = getPostEndPoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Array<IPost>>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axios.get(POST_ENDPOINT, { withCredentials: true });

      if (res) {
        return res.data;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, userId]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
