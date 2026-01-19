import React from "react";
import PostCard from "./PostCard";

const AllPosts = ({ posts, user }) => {
  if (!posts?.length)
    return <p className="text-gray-400 text-center">No posts yet.</p>;

  return (
    <div className="bg-[#1b1f23] border border-gray-700 rounded-xl overflow-hidden shadow-sm max-w-4xl w-full mx-auto">
      <h3 className="text-2xl font-bold text-yellow-300">Your Posts</h3>
      {posts.map((post) => (
        <PostCard post={post} user={user} />
      ))}
    </div>
  );
};

export default AllPosts;
