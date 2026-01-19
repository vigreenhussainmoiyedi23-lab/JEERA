import React, { useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreHorizontal,
  X,
  Copy,
  MessageCircle,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import ImageSwiper from "./PostCard/ImageSwiper";
import MainHead from "./PostCard/MainHead";
import Comments from "./PostCard/Comments";
import axiosInstance from "../../utils/axiosInstance";

const PostCard = ({ post, user }) => {
  const [openComments, setOpenComments] = useState(false);
  const [liked, setLiked] = useState(post.likedBy.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likedBy.length);

  const handleLike = async () => {
    try {
      const { data } = await axiosInstance.patch(
        `/post/likeUnlike/${post._id}`,
      );
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <div className="bg-[#1b1f23] border border-gray-700 rounded-xl pt-3 pb-1 shadow-sm mb-4  transition-all">
      {/* 1. Top Header Section (MainHead should contain Avatar, Name, Headline) */}
      <div className="px-4">
        <MainHead post={post} user={user} />
      </div>

      {/* 2. Post Description */}
      <div className="px-4 py-3 text-gray-200 text-sm md:text-[15px] leading-relaxed">
        {post.description}
      </div>

      {/* 3. Media Section */}
      {post.images && post.images.length > 0 && (
        <div className="border-y border-gray-800 bg-black/20">
          <ImageSwiper post={post} />
        </div>
      )}

      {/* 4. Social Stats (Like count, Comment count) */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-1 group cursor-pointer">
          <div className="flex -space-x-1">
            <div className="bg-blue-500 rounded-full p-0.5 border border-[#1b1f23]">
              <ThumbsUp size={10} className="text-white fill-white" />
            </div>
          </div>
          <span className="text-xs text-gray-400 hover:text-blue-400 hover:underline">
            {likeCount}
          </span>
        </div>
        <div className="text-xs text-gray-400 hover:text-blue-400 hover:underline cursor-pointer">
          {post.comments?.length || 0} comments
        </div>
      </div>

      {/* 5. Interaction Bar */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md hover:bg-white/5 transition-colors ${
            liked ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <ThumbsUp size={20} className={liked ? "fill-blue-400" : ""} />
          <span className="font-semibold text-sm">Like</span>
        </button>

        <button
          onClick={() => setOpenComments(!openComments)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md hover:bg-white/5 transition-colors text-gray-400"
        >
          <MessageSquare size={20} />
          <span className="font-semibold text-sm">Comment</span>
        </button>

        <div className="flex-1 hidden sm:flex items-center justify-center gap-2 py-3 rounded-md hover:bg-white/5 transition-colors text-gray-400">
          <ShareButton />
        </div>
      </div>

      {/* 6. Collapsible Comments Section */}
      {openComments && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
          <Comments post={post} user={user} />
        </div>
      )}
    </div>
  );
};

const ShareButton = ({ postId }) => {
  const [open, setOpen] = useState(false);
  const shareUrl = `${window.location.origin}/post/${postId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
    setOpen(false);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-1 text-sm sm:text-base px-2 py-1 rounded-md hover:bg-gray-700/20 transition text-gray-300 w-full h-full text-center "
      >
        <Share2 className="w-5 h-5" /> Share
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
          {/* Share Panel */}
          <div className="bg-gray-900 w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-5 animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Share post</h3>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <button
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
                    "_blank",
                  )
                }
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <FaWhatsapp className="text-green-500 text-3xl" />
                <span className="text-xs">WhatsApp</span>
              </button>

              <button
                onClick={() => alert("Instagram sharing works via mobile app")}
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <FaInstagram className="text-pink-500 text-3xl" />
                <span className="text-xs">Instagram</span>
              </button>

              <button
                onClick={() =>
                  window.open(`sms:?&body=${encodeURIComponent(shareUrl)}`)
                }
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <MessageCircle className="text-blue-400 w-8 h-8" />
                <span className="text-xs">Messages</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <Copy className="text-yellow-400 w-8 h-8" />
                <span className="text-xs">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
