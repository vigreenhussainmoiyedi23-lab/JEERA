const express = require("express");
const upload = require("../../config/multer");
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model")

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
Router.patch("/update/:postid", async (req, res) => {
    const user = req.user

    try {
        const { title, description } = req.body 
        if (!title || !description) {
            return res.status(400).json({ message: "title and description Both are required" })
        }
        const post = await postModel.findOneAndUpdate({ _id: req.params.postid }, {
            title,
            description
        },{
            new:true
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
Router.get("/feed",async function (req,res) {
    
})
module.exports = Router;