const chatModel = require("../models/chat.modal");
const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");

function chatSocket(io, socket, socketIdMap) {
  // ✅ Listen for messages

  socket.on("sendMessage", async ({ projectId, message }) => {
    const senderId = socket.user._id;
    const project = await projectModel.findById(projectId);
    const status = project.members.find(m => m.member.toString() == senderId).status
    // Save to DB
    const Newchat = await chatModel.create({
      user: senderId,
      message,
      project: projectId,
      status
    })
    const chat =await Newchat.populate({ path: "user", select: "username profilePic" })
    project.chats.push(chat._id);
    await project.save()
  
    io.to(projectId.toString()).emit("newMessage", chat);
  });
  socket.on("get-all-chats", async ({ projectId, message }) => {
    const senderId = socket.user._id;

    const project = await projectModel.findById(projectId).populate({ path: "chats", populate: { path: "user", select: "username profilePic" } });

    // Broadcast message to everyone in the same project room
    io.to(projectId.toString()).emit("all-chats", { chats: project.chats });
  });
}

module.exports = chatSocket;
