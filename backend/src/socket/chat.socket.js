const projectModel = require("../models/project.model");
const UserModel = require("../models/user.model");

function chatSocket(io, socket, socketIdMap) {
  // ✅ Listen for messages

  socket.on("sendMessage", async ({ projectId, message }) => {
    const senderId = socket.user.id;
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: senderId,
        },
      },
      { $unwind: { path: "$projects", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          "projects.project": projectId,
        },
      },
      {
        $project: {
          post: "$projects.status",
          username: 0
        },
      },
    ]);

    const project = await projectModel.findById(projectId);
    // Save to DB
    const chat = {
      Username: user[0].username,
      message,
      post: user[0].post,
    };
    project.chats.push(chat);
    await project.save()
    // Broadcast message to everyone in the same project room
    io.to(projectId).emit("newMessage", chat);
  });
  socket.on("get-all-chats", async ({ projectId, message }) => {
    const senderId = socket.user.id;

    const project = await projectModel.findById(projectId);

    // Broadcast message to everyone in the same project room
    io.to(socketIdMap.get(senderId)).emit("all-chats", { chats: project.chats });
  });
}

module.exports = chatSocket;
