import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { IPost } from "../types/post";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUnfollow, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/follow/${userId}`,
        { withCredentials: true }
      );

      if (res) {
        return res.data;
      }
    },
    onSuccess: (data) => {
      if (data.msg) {
        toast.success(data.msg);
      }
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response?.data.message || error.response?.data.error;
          toast.error(message);
        } else {
          toast.error(error.message);
        }
      } else {
        console.log(error);
      }
    },
  });

  return { followUnfollow, isPending };
};

export default useFollow;
