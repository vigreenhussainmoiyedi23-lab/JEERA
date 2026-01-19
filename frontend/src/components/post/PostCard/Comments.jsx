import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import CreateComment from "./comments/CreateComment";
import CommentCard from "./comments/CommentCard";

const Comments = ({ post, user }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch all comments
  const { data, isLoading, isError, error,refetch } = useQuery({
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
      refetch()
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
      refetch()
    },
  });

  // ✅ Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (id) =>
      await axiosInstance.delete(`/comment/${post._id}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      refetch()
    },
  });

  // ✅ Like / Unlike comment
  const likeCommentMutation = useMutation({
    mutationFn: async (id) =>
      (await axiosInstance.patch(`/comment/like/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      refetch()
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

      <CreateComment
        setNewComment={setNewComment}
        newComment={newComment}
        addCommentMutation={addCommentMutation}
      />

      {/* 💬 Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <CommentCard
            c={c}
            user={user}
            likeCommentMutation={likeCommentMutation}
            editCommentMutation={editCommentMutation}
            deleteCommentMutation={deleteCommentMutation}
            refetch={refetch}
          />
        ))
      )}
    </div>
  );
};

export default Comments;
