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
    const chat = await Newchat.populate({ path: "user", select: "username profilePic" })
    project.chats.push(chat._id);
    await project.save()

    io.to(projectId.toString()).emit("newMessage", chat);
  });

  socket.on("updateMessage", async ({ chatId, message, emoji }) => {
    function isEmoji(str) {
      return /^\p{Extended_Pictographic}$/u.test(str);
    }

    const senderId = socket.user._id.toString();
    const user = socket.user._id;

    const chat = await chatModel
      .findById(chatId)
      .populate("user", "username profilePic")
      .populate("reactions.user", "username profilePic");

    if (!chat) return;

    // if (emoji && isEmoji(emoji)) {
    //   const reactionIdx = chat.reactions.findIndex(
    //     (r) => r.user.toString() === senderId
    //   );

    //   if (reactionIdx === -1) {
    //     chat.reactions.push({ emoji, user });
    //   } else {
    //     chat.reactions[reactionIdx].emoji = emoji;
    //   }
    // }
    // 🟡 Handle emoji reaction
    if (emoji && isEmoji(emoji)) {
      const existingReactionIndex = chat.reactions.findIndex(
        (r) => r.user._id.toString() === senderId
      );

      // If user reacted before
      if (existingReactionIndex !== -1) {
        const currentEmoji = chat.reactions[existingReactionIndex].emoji;

        if (currentEmoji === emoji) {
          // 👇 same emoji clicked again → remove reaction
          chat.reactions.splice(existingReactionIndex, 1);
        } else {
          // 👇 different emoji → update it
          chat.reactions[existingReactionIndex].emoji = emoji;
        }
      } else {
        // 👇 new reaction
        chat.reactions.push({ emoji, user });
      }
    }
    if (message) {
      chat.message = message;
    }

    await chat.save();
    io.to(chat.project.toString()).emit("updatedMessage", chat);
  });

  socket.on("get-all-chats", async ({ projectId, message }) => {
    const senderId = socket.user._id;

    const project = await projectModel.findById(projectId).populate({ path: "chats", populate: { path: "user", select: "username profilePic" } });

    // Broadcast message to everyone in the same project room
    io.to(projectId.toString()).emit("all-chats", { chats: project.chats });
  });
}

module.exports = chatSocket;
// socket.on("updateMessage", async ({ chatId, message, emoji }) => {
//   function isEmoji(str) {
//     return /^\p{Extended_Pictographic}$/u.test(str);
//   }
//   const senderId = socket.user._id.toString();
//   const user = socket.user._id;
//   const chat = await chatModel.findById(chatId).populate("user","username profilePic").populate("reactions.user","username profilePic");
//   if (emoji && isEmoji(emoji)) {
//     const reactionIdx = chat.reactions.find(r => r.user?._id?.toString() === senderId)
//     if (reactionIdx == -1) {
//       chat.reactions.push({ emoji, user })
//     }
//     else {
//       chat.reactions.splice(reactionIdx, 1, {
//         emoji,
//         user
//       })
//     }
//   }
//   if (message) {
//     chat.message = message
//   }
//   await chat.save()
//   socket.to(projectId.toString()).emit("updatedMessage", chat);
// });
