import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { INotification } from "../../types/notification";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery<Array<INotification>>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/v1/notification", {
        withCredentials: true,
      });

      if (res) {
        return res.data;
      }
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        "http://localhost:3000/api/v1/notification",
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
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
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

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => deleteComment()}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
