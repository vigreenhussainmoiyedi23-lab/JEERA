import React from "react";

const PinnedChats = ({ pinnedChats,socket }) => {
  if (!pinnedChats.length) return null;

  return (
    <div className="bg-[#0F1726] p-2 border-b border-gray-700 flex space-x-2 overflow-x-auto">
      {pinnedChats.map((chat, idx) => (
        <div
          key={idx}
          className="bg-[#1E293B] px-3 py-1 rounded-full shadow-sm text-sm text-gray-300"
        >
          <span className="text-yellow-400">{chat.Username}:</span> {chat.message.slice(0, 20)}...
        </div>
      ))}
    </div>
  );
};

export default PinnedChats;
