
import React, { useState } from "react";
import { SendHorizonalIcon } from "lucide-react";
import axiosInstance from "../../../../utils/axiosInstance";

const CreateReply = ({ parentId, refetch }) => {
  const [newReply, setNewReply] = useState("");

  const handleReply = async () => {
    if (!newReply.trim()) return;
    await axiosInstance.post(`/comment/reply/${parentId}`, {
      message: newReply,
    });
    setNewReply("");
    refetch();
  };

  return (
    <div className="mt-3 flex gap-2">
      <textarea
        placeholder="Write a reply..."
        className="flex-1 bg-[#0f0f12] border border-gray-700 rounded-lg p-2 text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
      />
      <button
        onClick={handleReply}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
      >
        <SendHorizonalIcon size={18} />
      </button>
    </div>
  );
};

export default CreateReply;

