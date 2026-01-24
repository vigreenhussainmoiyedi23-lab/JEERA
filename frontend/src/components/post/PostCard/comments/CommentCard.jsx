import { useState } from "react";
import {
  Edit2,
  Heart,
  ReplyIcon,
  SendHorizonalIcon,
  Trash,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../utils/axiosInstance";

const CommentCard = ({
  c,
  user,
  likeCommentMutation,
  deleteCommentMutation,
  editCommentMutation,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [reply, setReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["replies", c._id],
    queryFn: async () =>
      (await axiosInstance.get(`/comment/replies/${c._id}`)).data.replies,
    enabled: showReplies,
    staleTime: 1000 * 60 * 5,
  });
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 hover:bg-white/8 hover:border-white/15 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={c.createdBy?.profilePic?.url || "/user.png"}
            className="h-9 w-9 rounded-full object-cover border border-white/10 bg-black/20"
            alt="pfp"
          />
          <div>
            <p className="text-gray-100 font-medium text-sm">
              {c.user?.username || "User"}
            </p>
            <p className="text-gray-400 text-xs">{c.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

      {c?.user?._id?.toString()==user?._id?.toString() && (  <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingId(c._id);
              setEditText(c.message);
            }}
            className="text-gray-400 hover:text-blue-400"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => deleteCommentMutation.mutate(c._id)}
            className="text-gray-400 hover:text-red-400"
          >
            <Trash size={16} />
          </button>
        </div>)}
      </div>

      {editingId === c._id ? (
        <div className="mt-3 space-y-2">
          <textarea
            className="w-full bg-black/25 border border-white/10 rounded-xl p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                editCommentMutation.mutate({ id: c._id, message: editText });
                setEditingId(null);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-black/30 hover:bg-black/40 border border-white/10 text-white px-3 py-1 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 text-sm mt-2 leading-relaxed">
          {c.message}
        </p>
      )}

      <div className="flex gap-5 mt-3 text-sm">
        <button
          onClick={() => likeCommentMutation.mutate(c._id)}
          className={`flex items-center gap-2 ${
            c.likedBy.includes(user._id)
              ? "text-blue-400"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <Heart size={16} />
          <span>{c.likedBy?.length || 0}</span>
        </button>
        <button
          onClick={() => setReply((prev) => !prev)}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
        >
          <ReplyIcon size={16} />
          Reply
        </button>
        <button
          onClick={() => setShowReplies((prev) => !prev)}
          className="text-gray-400 hover:text-blue-400"
        >
          {showReplies ? "Hide Replies" : "View Replies"}
        </button>
      </div>

      {reply && (
        <div className="mt-3 flex gap-2">
          <textarea
            placeholder="Write a reply..."
            className="flex-1 bg-black/25 border border-white/10 rounded-xl p-2 text-gray-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button
            onClick={async () => {
              await axiosInstance.post(`/comment/reply/${c._id}`, {
                message: newReply,
              });
              setNewReply("");
              setShowReplies(true);
              refetch();
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <SendHorizonalIcon size={18} />
          </button>
        </div>
      )}

      {showReplies && data && (
        <div className="mt-4 border-l border-gray-700 pl-4 space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-xs">No replies yet</p>
          ) : (
            data.map((r) => (
              <CommentCard
                key={r._id}
                c={r}
                user={r.user}
                likeCommentMutation={likeCommentMutation}
                editCommentMutation={editCommentMutation}
                deleteCommentMutation={deleteCommentMutation}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
