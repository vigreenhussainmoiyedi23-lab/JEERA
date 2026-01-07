const express = require("express");
const { ProfileIndexHandler, UpdateHandler } = require("../../controllers/user/profile.controllers");
const upload = require("../../config/multer");
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model")
const userModel = require("../../models/user.model")

const Router = express.Router();

Router.get("/", ProfileIndexHandler);
Router.patch("/update", UpdateHandler);
Router.post("/createPost", upload.fields([{
    name: "thumbnail",
    maxCount: 1,
},
{
    name: "images",
    maxCount: 5,
}]), async (req, res) => {
    const user = req.user
    try {
        const { thumbnail, images } = req.files
        const { title, description } = req.body
        if (!thumbnail || !title || !description) {
            return res.status(400).json({ message: "thumbnail title and description all three are required" })
        }
        let thumbnailUrl = {};
        let imagesUrl = [];

        // ✅ Upload thumbnail
        if (thumbnail && thumbnail.length > 0) {
            const result = await imagekit.upload({
                file: thumbnail[0].buffer,
                fileName: `${Date.now()}-${thumbnail[0].originalname}`,
                folder: "/jeera/projects/thumbnails",
            });
            thumbnailUrl = { url: result.url, fileId: result.fileId };
        }

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
        }
        const post = await postModel.create({
            thumbnail: thumbnailUrl,
            images: imagesUrl,
            title,
            description,
            createdBy: user._id
        })
        user.posts.push(post._id)
        await user.save()
        return res.status(200).json({
            message: "post created succesfully", 
            post: post.populate({
                path: "createdBy",
                select: "username email"
            })
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occured", error })
    }
})

module.exports = Router;
