import React from "react";

const ChatCard = ({ chat, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-yellow-400 text-[#0F1726]"
            : "bg-[#1E293B] text-gray-300"
        }`}
      >
        {!isOwn && <div className="font-semibold text-yellow-400">{chat.user?.username || "username"}</div>}
        <div>
          {chat.message}
          </div>
      </div>
    </div>
  );
};

export default ChatCard;
