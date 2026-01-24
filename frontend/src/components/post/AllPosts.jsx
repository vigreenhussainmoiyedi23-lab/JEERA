import React from "react";
import PostCard from "./PostCard";

const AllPosts = ({ posts, user }) => {
  if (!posts?.length)
    return <p className="text-gray-400 text-center">No posts yet.</p>;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] w-full overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Your posts</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-200/60">Recent activity</p>
      </div>
      <div className="p-5 space-y-5">
      {posts.map((post) => (
        <PostCard post={post} user={user} />
      ))}
      </div>
    </div>
  );
};

export default AllPosts;
