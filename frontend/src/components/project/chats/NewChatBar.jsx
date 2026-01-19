import React, { useState } from "react";
import socket from "../../../socket/socket";

const NewChatBar = ({ projectId, currentUser }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", { projectId, message });
    setMessage("");
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex p-2 border-t border-gray-700 bg-[#0F1726]"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-[#1E293B] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-yellow-400 text-[#0F1726] rounded-full font-semibold hover:bg-yellow-500 transition"
      >
        Send
      </button>
    </form>
  );
};

export default NewChatBar;
