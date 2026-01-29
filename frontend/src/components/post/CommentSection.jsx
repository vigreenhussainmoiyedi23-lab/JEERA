import React, { useState, useEffect } from "react";
import { ThumbsUp, MoreHorizontal, Reply, Edit2, Trash2, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comment/all/${postId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/comment/create/${postId}`, {
        message: newComment.trim()
      });
      
      // Add the new comment to the list
      const newCommentData = {
        ...response.data.comment,
        user: {
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic
        },
        likedBy: [],
        replies: []
      };
      
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/comment/reply/${parentCommentId}`, {
        message: replyText.trim()
      });
      
      // Add the reply to the parent comment
      const newReply = {
        ...response.data.comment,
        user: {
          _id: user._id,
          username: user.username,
          profilePic: user.profilePic
        },
        likedBy: []
      };
      
      setComments(comments.map(comment => 
        comment._id === parentCommentId 
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ));
      
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to post reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axiosInstance.patch(`/comment/like/${commentId}`);
      const liked = response.data.liked;
      
      // Update the liked status in the comments list
      const updateCommentLikes = (comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likedBy: liked 
              ? [...comment.likedBy, user._id]
              : comment.likedBy.filter(id => id !== user._id)
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateCommentLikes)
          };
        }
        return comment;
      };
      
      setComments(comments.map(updateCommentLikes));
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await axiosInstance.patch(`/comment/edit/${commentId}`, {
        message: editText.trim()
      });
      
      const updateCommentText = (comment) => {
        if (comment._id === commentId) {
          return { ...comment, message: editText.trim() };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateCommentText)
          };
        }
        return comment;
      };
      
      setComments(comments.map(updateCommentText));
      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axiosInstance.delete(`/comment/${postId}/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, isReply = false, parentCommentId = null }) => {
    const [showOptions, setShowOptions] = useState(false);
    const isAuthor = comment.user?._id === user?._id;

    return (
      <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/profile/${comment.user?._id}`)}
            className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            {comment.user?.profilePic?.url ? (
              <img
                src={comment.user.profilePic.url}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-black text-xs font-bold">
                {comment.user?.username?.substring(0, 2).toUpperCase() || "U"}
              </span>
            )}
          </button>
          
          <div className="flex-1">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${comment.user?._id}`)}
                    className="font-medium text-white text-sm hover:text-yellow-400 transition-colors"
                  >
                    {comment.user?.username || "Unknown"}
                  </button>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                
                {isAuthor && (
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {showOptions && (
                      <div className="absolute top-6 right-0 bg-slate-900 border border-white/10 rounded-lg shadow-lg py-1 z-10 min-w-32">
                        <button
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditText(comment.message);
                            setShowOptions(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-300 hover:bg-white/10 text-sm"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteComment(comment._id);
                            setShowOptions(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-400 hover:bg-white/10 text-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {editingComment === comment._id ? (
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      className="text-yellow-400 hover:text-yellow-300 font-medium text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditText("");
                      }}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-200 text-sm whitespace-pre-wrap">
                  {comment.message}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    comment.likedBy?.includes(user?._id)
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {comment.likedBy?.length || 0}
                </button>
                
                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                )}
              </div>
            </div>
            
            {/* Reply Form */}
            {replyingTo === comment._id && (
              <div className="mt-3">
                <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.user?.username}...`}
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={loading || !replyText.trim()}
                      className="text-yellow-400 hover:text-yellow-300 font-medium text-sm disabled:opacity-50"
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    isReply={true}
                    parentCommentId={comment._id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-5 pb-5 border-t border-white/10">
      <div className="pt-4">
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit}>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">
                {user?.username?.substring(0, 2).toUpperCase() || "YU"}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="text-yellow-400 hover:text-yellow-300 font-medium text-sm disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
        
        {/* Comments List */}
        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
