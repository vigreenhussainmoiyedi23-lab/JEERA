const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        message: String,
        User: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        post: {
            type: String,
            default: "member",
            enum: ["admin", "coAdmin", "member"],
        },
        project:{type:mongoose.Schema.Types.ObjectId,ref:"project"},
        createdAt: { type: Date, default: Date.now },

    },
    {
        toJSON: { virtuals: true }, // 👈 important
    }
);

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
