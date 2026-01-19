import React, { useRef, useEffect } from "react";
import ChatCard from "./ChatCard";
import { useState } from "react";
const AllChatsLayout = ({ chats, currentUser }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#0F1726]">
      {chats.map((chat, index) => (
        <div key={index} ref={scrollRef}>
          <ChatCard
            chat={chat}
            isOwn={chat.user.username === currentUser.username}
          />
        </div>
      ))}
    </div>
  );
};

export default AllChatsLayout;
