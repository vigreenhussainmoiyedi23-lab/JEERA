
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import CreateComment from "../comments/CreateComment";
import CommentCard from "../comments/CommentCard";

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
    mutationFn: async (message) => {
      const response = await axiosInstance.post(`/comment/create/${post._id}`, { message });
      return response.data;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["comments", post._id]);
      
      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(["comments", post._id]);
      
      // Optimistically update to the new value
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        message: newMessage,
        user: {
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic
        },
        createdAt: new Date().toISOString(),
        likedBy: [],
        replies: []
      };
      
      queryClient.setQueryData(["comments", post._id], (old = []) => [
        optimisticComment,
        ...old
      ]);
      
      setNewComment("");
      
      return { previousComments };
    },
    onError: (err, newMessage, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["comments", post._id], context.previousComments);
    },
    onSettled: () => {
      // Always refetch after error or success to make sure the server state is reflected
      queryClient.invalidateQueries(["comments", post._id]);
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ id, message }) => {
      const response = await axiosInstance.patch(`/comment/edit/${id}`, { message });
      return response.data;
    },
    onMutate: async ({ id, message }) => {
      await queryClient.cancelQueries(["comments", post._id]);
      
      const previousComments = queryClient.getQueryData(["comments", post._id]);
      
      queryClient.setQueryData(["comments", post._id], (old = []) =>
        old.map(comment =>
          comment._id === id ? { ...comment, message } : comment
        )
      );
      
      return { previousComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", post._id], context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", post._id]);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id) => {
      console.log(id, post._id);
      await axiosInstance.delete(`/comment/${post._id}/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(["comments", post._id]);
      
      const previousComments = queryClient.getQueryData(["comments", post._id]);
      
      queryClient.setQueryData(["comments", post._id], (old = []) =>
        old.filter(comment => comment._id !== id)
      );
      
      return { previousComments };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["comments", post._id], context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", post._id]);
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/comment/like/${id}`);
      return { id, liked: response.data.liked };
    },
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries(["comments", post._id]);
      
      const previousComments = queryClient.getQueryData(["comments", post._id]);
      
      queryClient.setQueryData(["comments", post._id], (old = []) =>
        old.map(comment =>
          comment._id === id
            ? {
                ...comment,
                likedBy: liked
                  ? [...(comment.likedBy || []), user._id]
                  : (comment.likedBy || []).filter(userId => userId !== user._id)
              }
            : comment
        )
      );
      
      return { previousComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", post._id], context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", post._id]);
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
    <div className="mt-6 w-full rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-4 text-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300">
      <h2 className="text-white font-semibold text-base sm:text-lg mb-4 tracking-tight">
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
        <div className="space-y-3 mt-3">
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
