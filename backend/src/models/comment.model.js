const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
        message: String,
        User: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toJSON: { virtuals: true }, // 👈 important
    }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
