const express = require("express");
const upload = require("../../config/multer");
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model");
const { default: mongoose } = require("mongoose");
const commentModel = require("../../models/comment.model");

const Router = express.Router();
Router.post("/create", upload.fields([
    {
        name: "images",
        maxCount: 5,
    }]), async (req, res) => {
        const user = req.user
        try {
            const { images } = req.files
            const { title, description } = req.body
            if (!title || !description) {
                return res.status(400).json({ message: "title and description Both are required" })
            }
            let thumbnailUrl = {};
            let imagesUrl = [];

            // ✅ Upload thumbnail


            // ✅ Upload multiple images
            if (images && images.length > 0) {
                const uploadedImages = await Promise.all(
                    images.map(async (img) => {
                        const result = await imagekit.upload({
                            file: img.buffer,
                            fileName: `${Date.now()}-${img.originalname}`,
                            folder: "/jeera/projects/images",
                        });
                        return { url: result.url, fileId: result.fileId };
                    })
                );

                imagesUrl = uploadedImages;
                thumbnailUrl = uploadedImages[0]
            }
            const post = await postModel.create({
                thumbnail: thumbnailUrl || null,
                images: imagesUrl || [],
                title,
                description,
                createdBy: user._id
            })
            const populatedPost = await post.populate("createdBy", "username email");
            user.posts.push(post._id)
            await user.save()
            return res.status(200).json({
                message: "post created succesfully",
                post: populatedPost
            })

        } catch (error) {
            return res.status(500).json({ message: "an error occured", error })
        }
    })
Router.delete("/delete/:postId", async (req, res) => {
    try {
        const user = req.user
        const post = await postModel.findOneAndDelete({ _id: req.params.postId })
        if (!post) {
            return res.status(400).json({ message: " post not found" })
        }
        post.images.map(i => {
            imagekit.deleteFile(i.fileId)
        })

        return res.status(200).json({
            message: "post deleted succesfully",
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occured", error })
    }
})
Router.patch("/update/:postId", async (req, res) => {
    const user = req.user

    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).json({ message: "title and description Both are required" })
        }
        const post = await postModel.findOneAndUpdate({ _id: req.params.postId }, {
            title,
            description
        }, {
            new: true
        })
        const populatedPost = await post.populate("createdBy", "username email");
        user.posts.push(post._id)
        return res.status(200).json({
            message: "post updated succesfully",
            post: populatedPost
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occured", error })
    }
})
Router.post("/feed", async (req, res) => {
    try {
        // 🧠 Get post IDs already sent from frontend
        const postsAlreadySent = req.body?.postIds || [];

        // 🧠 Convert to ObjectId
        const excludedIds = postsAlreadySent.map((id) =>
            new mongoose.Types.ObjectId(id)
        );

        // 🎲 Get random posts excluding the sent ones
        const posts = await postModel.aggregate([
            {
                $match: {
                    _id: { $nin: excludedIds },
                },
            },
            { $sample: { size: 12 } }, // pick 12 random posts
        ]);

        // 🧩 Populate 'createdBy' field (aggregate result doesn’t have populate)
        const populatedPosts = await postModel.populate(posts, {
            path: "createdBy",
            select: "username email profilePic",
        });

        // 📦 Extract the IDs so frontend can track what's sent
        const postIds = populatedPosts.map((p) => p._id);

        res.status(200).json({
            success: true,
            message: "Here are some random posts 🎲",
            posts: populatedPosts,
            postIds,
        });
    } catch (error) {
        console.error("❌ Error fetching random feed:", error.message);
        res.status(500).json({
            success: false,
            message: "Could not load feed",
            error: error.message,
        });
    }
});
// post  --> create comment
// patch --> Update comment
// delete--> delete comment
Router.post("/comment/:postId", async function (req, res) {
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
Router.delete("/comment/:postId/:commentId", async function (req, res) {
    try {
        const user = req.user

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
Router.patch("/comment/:postId/:commentId", async function (req, res) {
    try {
        const user = req.user

        const { message } = req.body
        const { postId, commentId } = req.params
        const post = await postModel.findById(postId)
        if (!message || !post) return res.status(400).json({ message: "Either postId is incorrect or message is empty" })
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
Router.get("/likeUnlike/:postId", async function (req, res) {
    try {
        const user = req.user
        let liked = false
        const { postId } = req.params
        const post = await postModel.findById(postId)
        if (!post) {
            res.status(400).json({ message: "No post found wrong postid" })
        }
        const idx = post.likedBy.findIndex(l => l.toString() == user._id.toString())
        if (idx == -1) {
            post.likedBy.push(user._id)
            liked = true
        }
        else {
            post.likedBy.splice(idx, 1)
        }
        await post.save()
        return res.status(200).json({
            message: liked ? "Liked Post Successfully" : "Unliked post successfully",
            liked
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})

module.exports = Router;