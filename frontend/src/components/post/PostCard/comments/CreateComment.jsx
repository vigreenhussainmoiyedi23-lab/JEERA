import React from "react";

const CreateComment = ({newComment ,setNewComment,addCommentMutation}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      {/* ➕ Add Comment */}
      <textarea
        placeholder="Write a comment..."
        className="flex-1 resize-none bg-transparent border border-gray-600 rounded-lg p-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        disabled={addCommentMutation.isLoading}
        onClick={() => addCommentMutation.mutate(newComment)}
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
      >
        {addCommentMutation.isLoading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CreateComment;
