import { useState } from "react";
import {
  Edit2,
  Heart,
  Reply,
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
  refetch,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [reply, setReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["replies"],
    queryFn: async () => {
      let data= (await axiosInstance.get(`/comment/replies/${c._id}`)).data.replies
      return data;
    },
    enabled: showReplies, // 🚫 Don't fetch automatically
    staleTime: 1000 * 60 * 5,
  });

  const handleShowReplies = async () => {
    setShowReplies((prev) => !prev);

    if (!showReplies && !data) {
      await refetch();
    }
  };
  const handleCreateReply = async () => {
    setShowReplies((prev) => !prev);
    setReplies(data);
    // ✅ Only fetch when opening replies
    if (!showReplies && !data) {
      await refetch();
    }
  };

  return (
    <div
      key={c._id}
      className="mb-4 border-b relative border-gray-800 pb-3 flex flex-col rounded-3xl px-5 py-2 bg-cyan-950"
    >
      {/* User name and pfp with optional edit button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <img
            src={c.createdBy?.profilePic?.url || "/user.png"}
            className="md:h-10 h-5 object-center object-cover rounded-full"
            alt="pfp"
          />
          <span className="font-semibold text-nowrap  overflow-hidden text-sm tracking-tighter font-mono sm:text-lg lg:text-xl text-yellow-300">
            {c.user?.username || "User"}
          </span>{" "}
        </div>
        <div className="flex gap-2 items-center justify-center">
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
              onClick={async () => {
                editCommentMutation.mutate({
                  id: c._id,
                  message: editText,
                });
                await refetch();
                setEditingId(null);
              }}
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
          <p className="mt-1 text-gray-300 text-sm">{c.message}</p>
        </>
      )}
      <div className="flex items-center justify-start gap-3">
        <button
          onClick={async () => {
            likeCommentMutation.mutate(c._id);
            await refetch();
          }}
          className="text-gray-400 hover:text-yellow-300 flex items-center justify-center gap-2"
        >
          {!c.likedBy.includes(user._id) ? <Heart /> : <span>❤️</span>}{" "}
          {c.likedBy?.length || 0}
        </button>
        <button
          onClick={function () {
            setReply((prev) => !prev);
          }}
          className="text-gray-400 hover:text-yellow-300 flex items-center justify-center gap-2"
        >
          <ReplyIcon /> Reply
        </button>

        <button
          onClick={handleShowReplies}
          className="text-gray-400 hover:text-yellow-300 flex items-center justify-center gap-2 bg-gray-800 rounded-2xl px-3 py-1"
        >
          View Replies
          <span className="font-light font-stretch-200% text-xs">V</span>
        </button>
      </div>{" "}
      {reply && (
        <div className="  flex flex-col sm:flex-row gap-2 mb-6 h-10">
          {/* ➕ Add Comment */}
          <textarea
            placeholder="Write a comment..."
            className="flex-1 resize-none bg-transparent border border-gray-600 rounded-lg p-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={newReply}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const res = await axiosInstance.post(
                  `/comment/reply/${c._id}`,
                  {
                    message: newReply,
                  }
                );
                replies.push(res.data.comment);
                setNewReply("");
              }
            }}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button
            onClick={async function () {
              const res = await axiosInstance.post(`/comment/reply/${c._id}`, {
                message: newReply,
              });
              replies.push(res.data.comment);
              setNewReply("");
            }}
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <SendHorizonalIcon />
          </button>
        </div>
      )}
      {showReplies && (
        <>
          {data?.length == 0 ? (
            <p>No replies yet</p>
          ) : (
            data &&
            data?.map((r) => {
              return (
                <CommentCard
                  c={r}
                  user={user}
                  likeCommentMutation={likeCommentMutation}
                  editCommentMutation={editCommentMutation}
                  deleteCommentMutation={deleteCommentMutation}
                  refetch={refetch}
                />
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default CommentCard;
