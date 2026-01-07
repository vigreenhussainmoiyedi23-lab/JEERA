import React from "react";

const AllPosts = ({ posts }) => {
  if (!posts?.length)
    return <p className="text-gray-400 text-center">No posts yet.</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-yellow-300">Your Posts</h3>
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-black/30 border border-gray-800 rounded-xl p-5 shadow-md"
        >
          <h4 className="text-xl font-semibold text-yellow-200">
            {post.title}
          </h4>
          <p className="text-gray-400">{post.description}</p>
          {post.images?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {post.images.map((img) => (
                <img
                  key={img.fileId}
                  src={img.url}
                  alt="post"
                  className="rounded-lg object-cover w-full h-32 sm:h-40"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllPosts;
