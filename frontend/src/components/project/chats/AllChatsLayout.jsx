// import React, { useRef, useEffect } from "react";
// import ChatCard from "./ChatCard";
// import { useState } from "react";
// const AllChatsLayout = ({ chats, currentUser,socket }) => {
//   const scrollRef = useRef();
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chats]);

//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-[#0F1726]">
//       {chats.map((chat, index) => (
//         <div key={index} ref={scrollRef}>
//           <ChatCard
//             chat={chat}
//             isOwn={chat.user.username === currentUser.username}
//             socket={socket}
//             user={chat.user}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AllChatsLayout;
import React, { useRef, useEffect } from "react";
import ChatCard from "./ChatCard";

// Helper functions
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const formatDateLabel = (date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) {
    return "Today";
  } else if (isSameDay(date, yesterday)) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    });
  }
};

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AllChatsLayout = ({ chats, currentUser, socket }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // 🟡 Sort chats by creation time (just in case)
  const sortedChats = [...chats].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  let lastDateLabel = null;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#0F1726]">
      {sortedChats.map((chat, index) => {
        const chatDate = new Date(chat.createdAt);
        const dateLabel = formatDateLabel(chatDate);
        const showDateLabel = dateLabel !== lastDateLabel;
        lastDateLabel = dateLabel;

        return (
          <div key={chat._id || index} ref={scrollRef}>
            {/* Date separator */}
            {showDateLabel && (
              <div className="flex justify-center my-4">
                <div className="text-gray-400 text-xs bg-[#1E293B] px-4 py-1 rounded-full">
                  {dateLabel}
                </div>
              </div>
            )}
            {/* Optional time under each message */}
            <div
              className={`text-[11px] text-gray-500 mt-1 ${
                chat.user.username === currentUser.username
                  ? "text-right pr-2"
                  : "text-left pl-2"
              }`}
            >
              {formatTime(chatDate)}
            </div>
            {/* Chat card */}
            <ChatCard
              chat={chat}
              isOwn={chat.user.username === currentUser.username}
              socket={socket}
              user={chat.user}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AllChatsLayout;
