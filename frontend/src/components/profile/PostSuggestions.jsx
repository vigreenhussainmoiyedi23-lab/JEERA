import React from "react";

const PostSuggestions = ({ posts }) => {
  if (!posts?.length)
    return (
      <p className="text-gray-400 text-center">No suggested posts yet.</p>
    );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-yellow-300">
        Suggested Posts
      </h3>
      {posts.map((p) => (
        <div
          key={p._id}
          className="bg-black/30 border border-gray-800 rounded-xl p-5"
        >
          <h4 className="text-lg font-semibold text-yellow-200">
            {p.title}
          </h4>
          <p className="text-gray-400 text-sm">{p.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            by {p.createdBy?.username || "Unknown"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostSuggestions;
