import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { IAuthUser } from "../../types/auth";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string>("");

  const imgRef = useRef(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ text, img }: { text: string; img: string }) => {
      const res = await axios.post(
        "http://localhost:3000/api/v1/post/create",
        {
          text,
          img,
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
      setText("");
      setImg("");
      if (data.msg) {
        toast.success(data.msg);
      } else {
        toast.success("Post created successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response.data?.message || error.response.data?.error;

          toast.error(message);
        } else {
          toast.error(error.message);
        }
      } else {
        console.log(error);
      }
    },
  });

  const { data: authUser } = useQuery<IAuthUser>({ queryKey: ["authUser"] });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    mutate({ text, img });
    e.preventDefault();
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          if (reader.result instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            const str = decoder.decode(reader.result);
            setImg(str);
          } else {
            setImg(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg("");
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
