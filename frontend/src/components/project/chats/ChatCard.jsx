import { useState, useEffect, useRef } from "react";
import { Copy, MessageSquare, Edit3, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatCard = ({ chat, isOwn, socket, user }) => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(chat.message);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false); // 🟢 mobile tap handler
  const cardRef = useRef();

  // 🟡 Detect outside click (close on mobile)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowActions(false);
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleCopy = () => navigator.clipboard.writeText(chat.message);

  const handleEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    socket.emit("updateMessage", { chatId: chat._id, emoji });
    setShowEmojiPicker(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    socket.emit("updateMessage", { chatId: chat._id, message: editMessage });
    setIsEditing(false);
  };

  const handleReply = () => {
    console.log("Reply to:", chat._id);
  };

  // 🟢 Toggle for mobile (tap instead of hover)
  const handleTap = () => {
    if (window.innerWidth <= 768) {
      // only on mobile
      setShowActions((prev) => !prev);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col ${
        isOwn ? "items-end" : "items-start"
      } mb-4`}
      onMouseEnter={() => setHovered(true)} // desktop hover
      onMouseLeave={() => setHovered(false)} // desktop leave
      onClick={handleTap} // mobile tap
    >
      {/* Chat Bubble */}
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl relative ${
          isOwn ? "bg-yellow-400 text-[#0F1726]" : "bg-[#1E293B] text-gray-300"
        }`}
      >
        {!isOwn && (
          <div className="font-semibold text-yellow-400 mb-1">
            {chat.user?.username || "username"}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex gap-2">
            <input
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              className="flex-1 bg-transparent border-b border-gray-400 outline-none"
              autoFocus
            />
            <button type="submit" className="text-sm font-semibold">
              ✅
            </button>
          </form>
        ) : (
          <div>{chat.message}</div>
        )}
      </div>

      {/* Reactions */}
      {chat.reactions?.length > 0 && (
        <div className="mt-1 flex gap-2 flex-wrap">
          {Object.entries(
            chat.reactions.reduce((acc, r) => {
              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
              return acc;
            }, {})
          ).map(([emoji, count]) => (
            <span
              key={emoji}
              className="bg-slate-700 rounded-full px-2 py-1 text-sm flex items-center gap-1"
            >
              {emoji} {count > 1 && <span className="text-xs">x{count}</span>}
            </span>
          ))}
        </div>
      )}

      {/* Hover/Tap Action Buttons (below the message) */}
      {(hovered || showActions) && (
        <div
          className={`flex gap-3 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          } w-full`}
        >
          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker((prev) => !prev);
              }}
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              <Smile size={16} />
            </button>

            {showEmojiPicker && (
              <div
                className={`absolute z-50 ${
                  isOwn ? "right-0" : "left-0"
                } bottom-6`}
              >
                <EmojiPicker
                  theme="dark"
                  height={350}
                  width={300}
                  onEmojiClick={handleEmojiSelect}
                />
              </div>
            )}
          </div>

          {/* Copy */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <Copy size={16} />
          </button>

          {/* Reply */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReply();
            }}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <MessageSquare size={16} />
          </button>

          {/* Edit (only for own) */}
          {isOwn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              <Edit3 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatCard;
