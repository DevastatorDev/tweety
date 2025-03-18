import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface IFormData {
  fullName?: string;
  username?: string;
  email?: string;
  bio?: string;
  link?: string;
  newPassword?: string;
  currentPassword?: string;
  coverImg?: string;
  profileImg?: string;
}

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData: IFormData) => {
      const res = await axios.put(
        `http://localhost:3000/api/v1/user/update`,
        {
          ...formData,
        },
        {
          withCredentials: true,
        }
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
        queryClient.invalidateQueries({ queryKey: ["userprofile"] }),
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

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
