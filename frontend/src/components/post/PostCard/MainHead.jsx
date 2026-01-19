import React from "react";
import { Trash, Edit2 } from "lucide-react";

const MainHead = ({ post, user }) => {
  return (
    <>
      <div className="flex items-center justify-between  ">
        <div className="flex  items-center justify-center gap-2">
          <img
            src={post.createdBy.profilePic?.url || "/user.png"}
            className="w-10 h-10 md:w-20 md:h-20 rounded-full object-center object-cover border border-yellow-400"
            alt="profilePic"
          />
          <h1>{post.createdBy.username || "User"}</h1>
        </div>
        {user._id.toString() === post.createdBy._id.toString() && (
          <div>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-blue-500  font-extrabold px-3 py-2 rounded-2xl">
              <Edit2 />
            </button>
            <button className="text-sm md:text-lg xl:text-2xl active:scale-110 hover:cursor-pointer text-red-600  font-extrabold px-3 py-2 rounded-2xl">
              <Trash />
            </button>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-xl font-semibold text-yellow-200">{post.title}</h4>
        <p className="text-gray-400">{post.description}</p>
      </div>
    </>
  );
};

export default MainHead;
