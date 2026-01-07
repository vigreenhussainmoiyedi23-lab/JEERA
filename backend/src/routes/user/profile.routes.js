const express = require("express");
const { ProfileIndexHandler, UpdateHandler } = require("../../controllers/user/profile.controllers");
const upload = require("../../config/multer");
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model")
const userModel = require("../../models/user.model")

const Router = express.Router();

Router.get("/", ProfileIndexHandler);
Router.patch("/update", UpdateHandler);
// Router.post("/createPost", upload.fields([
//     {
//         name: "images",
//         maxCount: 5,
//     }]), async (req, res) => {
//         const user = req.user
//         try {
//             const { images } = req.files
//             const { title, description } = req.body
//             if (!title || !description) {
//                 return res.status(400).json({ message: "thumbnail title and description all three are required" })
//             }
//             let thumbnailUrl = {};
//             let imagesUrl = [];

//             // ✅ Upload thumbnail


//             // ✅ Upload multiple images
//             if (images && images.length > 0) {
//                 const uploadedImages = await Promise.all(
//                     images.map(async (img) => {
//                         const result = await imagekit.upload({
//                             file: img.buffer,
//                             fileName: `${Date.now()}-${img.originalname}`,
//                             folder: "/jeera/projects/images",
//                         });
//                         return { url: result.url, fileId: result.fileId };
//                     })
//                 );

//                 imagesUrl = uploadedImages;
//                 thumbnailUrl = uploadedImages[0]
//             }
//             const post = await postModel.create({
//                 thumbnail: thumbnailUrl || null,
//                 images: imagesUrl || [],
//                 title,
//                 description,
//                 createdBy: user._id
//             })
//             const populatedPost = await post.populate("createdBy", "username email");
//             user.posts.push(post._id)
//             await user.save()
//             return res.status(200).json({
//                 message: "post created succesfully",
//                 post: populatedPost
//             })

//         } catch (error) {
//             return res.status(500).json({ message: "an error occured", error })
//         }
//     })

// Router.patch("/updatePost", upload.fields([
//     {
//         name: "images",
//         maxCount: 5,
//     }]), async (req, res) => {
//         const user = req.user
//         try {
//             const { images } = req.files
//             const { title, description } = req.body
//             if (!title || !description) {
//                 return res.status(400).json({ message: "thumbnail title and description all three are required" })
//             }
//             let thumbnailUrl = {};
//             let imagesUrl = [];

//             // ✅ Upload thumbnail


//             // ✅ Upload multiple images
//             if (images && images.length > 0) {
//                 const uploadedImages = await Promise.all(
//                     images.map(async (img) => {
//                         const result = await imagekit.upload({
//                             file: img.buffer,
//                             fileName: `${Date.now()}-${img.originalname}`,
//                             folder: "/jeera/projects/images",
//                         });
//                         return { url: result.url, fileId: result.fileId };
//                     })
//                 );

//                 imagesUrl = uploadedImages;
//                 thumbnailUrl = uploadedImages[0]
//             }
//             const post = await postModel.create({
//                 thumbnail: thumbnailUrl || null,
//                 images: imagesUrl || [],
//                 title,
//                 description,
//                 createdBy: user._id
//             })
//             const populatedPost = await post.populate("createdBy", "username email");
//             user.posts.push(post._id)
//             await user.save()
//             return res.status(200).json({
//                 message: "post created succesfully",
//                 post: populatedPost
//             })

//         } catch (error) {
//             return res.status(500).json({ message: "an error occured", error })
//         }
//     })

module.exports = Router;
