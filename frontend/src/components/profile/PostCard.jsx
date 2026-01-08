import React, { useState } from "react";

import ImageSwiper from "./PostCard/ImageSwiper";
import MainHead from "./PostCard/MainHead";
import Comments from "./PostCard/Comments";
import { Heart } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const PostCard = ({ post, user }) => {
  const [openComments, setOpenComments] = useState(false);
  const [liked, setliked] = useState(post.likedBy.includes(user._id));
  return (
    <div
      key={post._id}
      className="bg-black/30 border border-gray-800 rounded-xl p-5 shadow-md"
    >
      <MainHead post={post} user={user} />
      {post.images.length > 0 && <ImageSwiper post={post} />}
      <div className="mt-5 flex items-center justify-evenly">
        <button
          onClick={async function () {
            const { data } = await axiosInstance.patch(
              `/post/likeUnlike/${post._id}`
            );
            setliked(data.liked);
          }}
        >
          {!liked ? (
            <Heart className={` inset-shadow-2xl   shadow-red-600`} />
          ) : (
            "❤️"
          )}
        </button>
        <button onClick={async function () {
          setOpenComments(prev=>!prev)
        }}>
         🗨️
        </button>
      </div>
      {openComments && <Comments post={post} user={user}/>}
    </div>
  );
};

export default PostCard;
