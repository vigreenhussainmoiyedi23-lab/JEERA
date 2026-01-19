const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        message: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        status: {
            type: String,
            default: "member",
            enum: ["admin", "coAdmin", "member"],
        },
        project:{type:mongoose.Schema.Types.ObjectId,ref:"project"},
        isPinned:{type:Boolean,default:false},
        reactions:[],
        createdAt: { type: Date, default: Date.now },

    },
    {
        toJSON: { virtuals: true }, // 👈 important
    }
);

const chatModel = mongoose.model("chat", chatSchema);

module.exports = chatModel;
