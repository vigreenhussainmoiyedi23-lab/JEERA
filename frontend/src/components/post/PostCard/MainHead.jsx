import React from "react";
import { Trash, Edit2 } from "lucide-react";

const MainHead = ({ post, user }) => {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.createdBy.profilePic?.url || "/user.png"}
            className="w-11 h-11 md:w-14 md:h-14 rounded-full object-center object-cover border border-white/10 bg-black/20"
            alt="profilePic"
          />
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-semibold text-white leading-tight truncate">
              {post.createdBy.username || "User"}
            </h1>
            <p className="text-xs text-gray-200/60 truncate">
              {post.title}
            </p>
          </div>
        </div>
        {user._id.toString() === post.createdBy._id.toString() && (
          <div>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-blue-400 hover:text-blue-300 font-extrabold p-2 rounded-xl hover:bg-white/5 transition">
              <Edit2 />
            </button>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-red-400 hover:text-red-300 font-extrabold p-2 rounded-xl hover:bg-white/5 transition">
              <Trash />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MainHead;
