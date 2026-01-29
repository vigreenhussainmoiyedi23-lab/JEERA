import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { X, Send, Edit3, Trash2, Smile, Copy, Reply } from "lucide-react";

function TaskChatModal({ taskId, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  const commonEmojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉", "💯"];

  useEffect(() => {
    fetchMessages();
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/task/${taskId}/chat`);
      console.log("Fetched messages:", data);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("Send message form submitted!", { newMessage, taskId, replyingTo });
    
    if (!newMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }

    try {
      const messageData = {
        message: newMessage.trim(),
        replyTo: replyingTo?._id
      };

      console.log("Message data:", messageData);
      console.log("Making POST request to:", `/task/${taskId}/chat`);

      const { data } = await axiosInstance.post(`/task/${taskId}/chat`, messageData);
      console.log("Send message response:", data);
      
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      // Don't show alert for now, just log to console
    }
  };

  const editMessage = async (messageId) => {
    try {
      const { data } = await axiosInstance.patch(`/task/${taskId}/chat/${messageId}`, {
        message: editText
      });
      
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? data.message : msg
      ));
      setEditingMessage(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await axiosInstance.delete(`/task/${taskId}/chat/${messageId}`);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const { data } = await axiosInstance.post(`/task/${taskId}/chat/${messageId}/react`, { emoji });
      
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? data.message : msg
      ));
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const copyMessage = async (messageId) => {
    try {
      const { data } = await axiosInstance.get(`/task/${taskId}/chat/${messageId}/copy`);
      await navigator.clipboard.writeText(data.message);
      // Show toast or feedback
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const startEdit = (message) => {
    setEditingMessage(message._id);
    setEditText(message.message);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return messageDate.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Task Chat</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">No messages yet</div>
              <div className="text-slate-500 text-sm">Start the conversation!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map((message) => (
                    <div key={message._id} className="space-y-2">
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className="ml-8 pl-4 border-l-2 border-slate-600">
                          <div className="text-xs text-slate-500 mb-1">
                            Replying to {message.replyTo.sender?.username}
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <div className="text-sm text-slate-300 line-clamp-2">
                              {message.replyTo.message}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`flex gap-3 ${message.sender._id === currentUser._id ? "flex-row-reverse" : ""}`}>
                        <img
                          src={message.sender.profilePic?.url || "/user.png"}
                          alt={message.sender.username}
                          className="w-8 h-8 rounded-full shrink-0"
                        />
                        
                        <div className={`max-w-md ${message.sender._id === currentUser._id ? "text-right" : ""}`}>
                          <div className="text-xs text-slate-500 mb-1">
                            {message.sender.username} • {formatTime(message.createdAt)}
                            {message.edited && " • edited"}
                          </div>
                          
                          <div className={`bg-slate-800 rounded-lg p-3 inline-block ${
                            message.sender._id === currentUser._id ? "bg-blue-600/20" : ""
                          }`}>
                            {editingMessage === message._id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => editMessage(message._id)}
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-white text-sm">{message.message}</div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className={`flex items-center gap-2 mt-1 text-xs ${
                            message.sender._id === currentUser._id ? "justify-end" : ""
                          }`}>
                            <button
                              onClick={() => setReplyingTo(message)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              <Reply className="w-3 h-3" />
                            </button>
                            
                            {message.sender._id === currentUser._id && (
                              <>
                                <button
                                  onClick={() => startEdit(message)}
                                  className="text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteMessage(message._id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => copyMessage(message._id)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>

                            {/* Reactions */}
                            <div className="flex items-center gap-1">
                              {commonEmojis.map(emoji => {
                                const hasReacted = message.reactions?.some(
                                  r => r.emoji === emoji && r.user._id === currentUser._id
                                );
                                const reactionCount = message.reactions?.filter(r => r.emoji === emoji).length || 0;
                                
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => addReaction(message._id, emoji)}
                                    className={`px-1 py-0.5 rounded text-xs transition-colors ${
                                      hasReacted 
                                        ? "bg-blue-600/30 text-blue-400" 
                                        : "hover:bg-slate-700 text-slate-400"
                                    }`}
                                  >
                                    {emoji} {reactionCount > 0 && reactionCount}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-6 py-2 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Replying to {replyingTo.sender?.username}: "{replyingTo.message}"
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskChatModal;
