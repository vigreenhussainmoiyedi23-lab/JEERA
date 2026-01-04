const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");

function chatSocket(io, socket) {
  // ✅ Listen for messages

  socket.on("sendMessage", async ({ projectId, message }) => {
    const senderId = socket.user.id;
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: senderId,
        },
      },
      { $unwind: "$projects" },
      {
        $match: {
          "projects.project": projectId,
        },
      },
      {
        $project: {
          post: "$projects.status",
        },
      },
    ]);
    
    const project = await projectModel.findById(projectId);
    // Save to DB
    const chat = {
      User: senderId,
      message,
      post: user[0].post,
    };
    project.chats.push(chat);
    await project.save()
    // Broadcast message to everyone in the same project room
    io.to(projectId).emit("newMessage", chat);
  });
}

module.exports = chatSocket;
