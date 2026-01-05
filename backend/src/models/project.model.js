const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: String,
    description: { type: String, default: "" },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    members: [{member:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },}
    ],
    coAdmins: [{coAdmin:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },}
    ],
    chats: [
      {
        type:mongoose.Schema.Types.ObjectId,ref:"chat"
      },
    ],
    Excluded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    invited: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    //messages like pop up for admin so that he can know what important thing happened and can
    newMessages: [
      {
        title: String,
        User: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        CreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    //mark as read to delete from db
    allTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true }, // 👈 important
  }
);

const projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
