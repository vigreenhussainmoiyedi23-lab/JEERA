
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import CreateComment from "./comments/CreateComment";
import CommentCard from "./comments/CommentCard";

const Comments = ({ post, user }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: async () =>
      (await axiosInstance.get(`/comment/all/${post._id}`)).data.comments,
    staleTime: 1000 * 60 * 5,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (message) =>
      (await axiosInstance.post(`/comment/create/${post._id}`, { message }))
        .data.comment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      setNewComment("");
      refetch();
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ id, message }) =>
      (await axiosInstance.patch(`/comment/edit/${id}`, { message })).data
        .comment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      refetch();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id) =>{
      console.log(id,post._id)
      await axiosInstance.delete(`/comment/${post._id}/${id}`)},
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      refetch();
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (id) =>
      (await axiosInstance.patch(`/comment/like/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post._id]);
      refetch();
    },
  });

  if (isLoading)
    return (
      <p className="flex items-center justify-center text-gray-400">
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
    <div className="mt-6 w-full bg-[#0e0e10] border border-gray-800 rounded-2xl p-4 text-gray-200 shadow-lg shadow-black/40 transition-all duration-300">
      <h2 className="text-gray-100 font-semibold text-lg mb-4 tracking-tight">
        Comments
      </h2>

      <CreateComment
        setNewComment={setNewComment}
        newComment={newComment}
        addCommentMutation={addCommentMutation}
      />

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No comments yet.</p>
      ) : (
        <div className="space-y-4 mt-3">
          {comments.map((c) => (
            <CommentCard
              key={c._id}
              c={c}
              user={user}
              likeCommentMutation={likeCommentMutation}
              editCommentMutation={editCommentMutation}
              deleteCommentMutation={deleteCommentMutation}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
