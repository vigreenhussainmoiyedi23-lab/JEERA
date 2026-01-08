const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
        message: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        },
        createdAt: { type: Date, default: Date.now },
        replies:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment", 
        }],
        isReply:{type:Boolean,default:false},
        likedBy:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }]
    },
    {
        toJSON: { virtuals: true }, // 👈 important
    }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
