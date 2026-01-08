import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { Edit2, Heart, Trash } from "lucide-react";

const Comments = ({ post, user }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ Fetch all comments
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: async () =>
      (await axiosInstance.get(`/comment/all/${post._id}`)).data.comments,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Add new comment
  const addCommentMutation = useMutation({
    mutationFn: async (message) =>
      (await axiosInstance.post(`/comment/create/${post._id}`, { message }))
        .data.comment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      setNewComment("");
    },
  });

  // ✅ Edit comment
  const editCommentMutation = useMutation({
    mutationFn: async ({ id, message }) =>
      (await axiosInstance.patch(`/comment/edit/${id}`, { message })).data
        .comment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      setEditingId(null);
      setEditText("");
    },
  });

  // ✅ Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (id) =>
      await axiosInstance.delete(`/comment/${post._id}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
    },
  });

  // ✅ Like / Unlike comment
  const likeCommentMutation = useMutation({
    mutationFn: async (id) =>
      (await axiosInstance.patch(`/comment/like/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
    },
  });

  // Loading & Error states
  if (isLoading)
    return (
      <p className="flex items-center justify-center text-yellow-200">
        Loading comments...
      </p>
    );
  if (isError)
    return (
      <p className="text-red-400">
        Error: {error?.message || "Failed to load comments"}
      </p>
    );

  const comments = data || [];

  return (
    <div className="mt-6 w-full bg-black/30 border border-gray-800 rounded-2xl p-4 text-gray-300">
      <h2 className="text-yellow-300 font-bold text-lg mb-4">Comments</h2>

      {/* ➕ Add Comment */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
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

      {/* 💬 Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c._id}
            className="mb-4 border-b border-gray-800 pb-3 flex flex-col rounded-3xl px-5 py-2 bg-cyan-950"
          >
            <div className="flex items-center justify-between md:flex-row flex-col">
              <span className="font-semibold text-yellow-300">
                {c.user?.username || "User"}
              </span>
              <div className="space-x-2 text-sm">
                <button
                  onClick={() => likeCommentMutation.mutate(c._id)}
                  className="text-gray-400 hover:text-yellow-300"
                >
                  {!c.likedBy.includes(user._id) ? (
                    <Heart />
                  ) : (
                    <span className="block">❤️</span>
                  )}{" "}
                  {c.likedBy?.length || 0}
                </button>
                <button
                  onClick={() => {
                    setEditingId(c._id);
                    setEditText(c.message);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit2 />
                </button>
                <button
                  onClick={() => deleteCommentMutation.mutate(c._id)}
                  className="text-red-600 hover:text-red-500"
                >
                  <Trash />
                </button>
              </div>
            </div>

            {/* ✏️ Editing */}
            {editingId === c._id ? (
              <div className="mt-2 flex flex-col gap-2">
                <textarea
                  className="resize-none bg-black/50 border border-gray-600 p-2 rounded-lg text-gray-200"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editCommentMutation.mutate({
                        id: c._id,
                        message: editText,
                      })
                    }
                    className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <hr className="w-1/2"/>
                <p className="mt-1 text-gray-300 text-sm">{c.message}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
