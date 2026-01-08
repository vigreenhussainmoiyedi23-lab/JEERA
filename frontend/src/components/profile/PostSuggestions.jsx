import React from "react";
import PostCard from "./PostCard";

const PostSuggestions = ({ posts ,user}) => {
  if (!posts?.length)
    return <p className="text-gray-400 text-center">No suggested posts yet.</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-yellow-300">Suggested Posts</h3>
      {posts.map((p) => (
        <PostCard post={p} user={user}/>
      ))}
    </div>
  );
};

export default PostSuggestions;
