
import React from "react";

const CreateComment = ({ newComment, setNewComment, addCommentMutation }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <textarea
        placeholder="Write a comment..."
        className="flex-1 resize-none bg-[#1b1b1f] border border-gray-700 rounded-lg p-3 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        disabled={addCommentMutation.isLoading}
        onClick={() => addCommentMutation.mutate(newComment)}
        className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
      >
        {addCommentMutation.isLoading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CreateComment;
