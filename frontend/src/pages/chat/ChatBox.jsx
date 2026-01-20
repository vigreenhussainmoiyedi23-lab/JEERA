import AllChatsLayout from "../../components/project/chats/AllChatsLayout";
import PinnedChats from "../../components/project/chats/PinnedChats";
import NewChatBar from "../../components/project/chats/NewChatBar";
import React, { useEffect, useState } from "react";
import socket from "../../socket/socket";

const ChatBox = ({ projectId, currentUser }) => {
  const [chats, setChats] = useState([]);
  const [pinnedChats, setPinnedChats] = useState([]);

  // useEffect(() => {
  //   if (!projectId) return;

  //   socket.emit("joinProject", projectId);
  //   socket.emit("get-all-chats", { projectId });

  //   const handleAllChats = ({ chats }) => setChats(chats || []);
  //   const handleNewMessage = (chat) => setChats((prev) => [...prev, chat]);

  //   socket.on("all-chats", handleAllChats);
  //   socket.on("newMessage", handleNewMessage);

  //   return () => {
  //     socket.emit("leaveProject", projectId);
  //     socket.off("all-chats", handleAllChats);
  //     socket.off("newMessage", handleNewMessage);
  //   };
  // }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    socket.emit("joinProject", projectId);
    socket.emit("get-all-chats", { projectId });

    const handleAllChats = ({ chats }) => setChats(chats || []);
    const handleNewMessage = (chat) => setChats((prev) => [...prev, chat]);
    const handleUpdatedMessage = (chat) =>
      setChats((prev) => prev.map((c) => (c._id === chat._id ? chat : c)));

    socket.on("all-chats", handleAllChats);
    socket.on("newMessage", handleNewMessage);
    socket.on("updatedMessage", handleUpdatedMessage);

    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("all-chats", handleAllChats);
      socket.off("newMessage", handleNewMessage);
      socket.off("updatedMessage", handleUpdatedMessage);
    };
  }, [projectId]);

  return (
    <div className="flex flex-col h-[80vh] w-full rounded-lg shadow-lg overflow-x-hidden bg-gradient-to-b from-[#040813] to-[#0F1726] border border-gray-800">
      <PinnedChats pinnedChats={pinnedChats} socket={socket}/>
      <AllChatsLayout chats={chats} currentUser={currentUser} socket={socket}/>
      <NewChatBar projectId={projectId} currentUser={currentUser} />
    </div>
  );
};

export default ChatBox;
