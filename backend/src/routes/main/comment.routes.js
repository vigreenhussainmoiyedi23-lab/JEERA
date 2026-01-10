const express = require("express");
const upload = require("../../config/multer");
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model");
const { default: mongoose } = require("mongoose");
const commentModel = require("../../models/comment.model");
const { populate } = require("dotenv");

// post  --> create comment
// patch --> Update comment
// delete--> delete comment

const Router = express.Router();
Router.get("/all/:postId", async function (req, res) {
    try {
        const { postId } = req.params;

        const comments = await commentModel
            .find({ post: postId, isReply: false })
            .sort({ createdAt: -1 })
            .populate({
                path: "user", // ✅ use correct field name (your schema uses "user", not "createdBy")
                select: "username email profilePic",
            })
        return res.status(200).json({
            success: true,
            message: "Here are all comments",
            comments,
        });
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching comments",
            error: error.message,
        });
    }
});
Router.get("/replies/:commentId", async function (req, res) {
    try {
        const { commentId } = req.params;

        const { replies } = await commentModel
            .findById(commentId)
            .populate({
                path: "user", // ✅ use correct field name (your schema uses "user", not "createdBy")
                select: "username email profilePic",
            })
            .populate({
                path: "replies",
                populate: {
                    path: "user", // ✅ again, it’s "user" not "createdBy"
                    select: "username email profilePic",
                },
            });

        return res.status(200).json({
            success: true,
            message: "Here are all replies ",
            replies,
        });
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching comments",
            error: error.message,
        });
    }
});

Router.post("/create/:postId", async function (req, res) {
    try {
        const user = req.user
        const { message } = req.body
        const { postId } = req.params
        const post = await postModel.findById(postId)
        if (!message || !post) return res.status(400).json({ message: "Either postId is incorrect or message is empty" })
        const comment = await commentModel.create({
            message,
            user: user._id,
            post: postId
        })
        post.comments.push(comment._id)
        await post.save()
        return res.status(200).json({
            message: "comment posted successfully",
            comment
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            error
        })
    }
})
Router.delete("/:postId/:commentId", async function (req, res) {
    try {
        const { message } = req.body
        const { postId, commentId } = req.params
        const post = await postModel.findById(postId)
        if (!message || !post) return res.status(400).json({ message: "Either postId is incorrect or message is empty" })
        const comment = await commentModel.findByIdAndUpdate(commentId, {
            message,
        })
        const pindex = post.comments.findIndex(p => p.toString() == postId.toString())
        post.comments.splice(pindex, 1)
        await post.save()
        return res.status(200).json({
            message: "comment deleted succesfully",
            comment
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            error
        })
    }
})
Router.patch("/like/:commentId", async (req, res) => {
    try {
        const user = req.user;
        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        const index = comment.likedBy.findIndex((u) => u.toString() === user._id.toString());
        let liked = false;
        if (index === -1) {
            comment.likedBy.push(user._id);
            liked = true;
        } else {
            comment.likedBy.splice(index, 1);
        }

        await comment.save();
        res.status(200).json({ message: liked ? "Liked comment" : "Unliked comment", liked });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
Router.patch("/edit/:commentId", async function (req, res) {
    try {
        const { message } = req.body
        const { commentId } = req.params
        const comment = await commentModel.findByIdAndUpdate(commentId, {
            message,
        })
        return res.status(200).json({
            message: "comment updated succesfully",
            comment
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            error
        })
    }
})
Router.post("/reply/:parentCommentId", async function (req, res) {
    try {
        const { message } = req.body
        const { parentCommentId } = req.params
        const comment = await commentModel.create({
            message,
            user: req.user._id,
            parentCommentId,
            isReply: true
        })
        await commentModel.findByIdAndUpdate(parentCommentId,
            {
                $push: { replies: comment._id }
            },
            {
                new: true
            })
        return res.status(200).json({
            message: "reply added succesfully",
            comment
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong",
            error
        })
    }
})


module.exports = Router;