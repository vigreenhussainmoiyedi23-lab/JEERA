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
Router.patch("/update/:commentId", async function (req, res) {
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
            commentId,
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
            commentId,
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

module.exports = Router;