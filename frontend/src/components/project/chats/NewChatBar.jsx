import React, { useState } from "react";
import socket from "../../../socket/socket";
import EmojiPicker from "emoji-picker-react";

const NewChatBar = ({ projectId, currentUser }) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", { projectId, message });
    setMessage("");
    setShowPicker(false); // close picker after send
  };

  return (
    <form
      onSubmit={sendMessage}
      className="relative flex items-center p-2 border-t border-gray-700 bg-[#0F1726]"
    >
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="text-2xl px-2 hover:scale-110 transition-transform"
      >
        😀
      </button>

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-[#1E293B] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
      />

      {/* Send Button */}
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-yellow-400 text-[#0F1726] rounded-full font-semibold hover:bg-yellow-500 transition"
      >
        Send
      </button>

      {/* Emoji Picker (popup) */}
      {showPicker && (
        <div className="absolute bottom-14 left-0 z-50">
          <EmojiPicker
            theme="dark"
            onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
          />
        </div>
      )}
    </form>
  );
};

export default NewChatBar;
