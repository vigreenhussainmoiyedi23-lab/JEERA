const express = require("express");
const multer = require("multer");
const imagekit = require("../../config/Imagekit");
const UserModel = require("../../models/user.model");

const Router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload banner
Router.post("/upload/banner", upload.single('banner'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old banner file from ImageKit if exists
    if (user.profileBanner?.fileId) {
      try {
        await imagekit.deleteFile(user.profileBanner.fileId);
        console.log("Old banner deleted from ImageKit:", user.profileBanner.fileId);
      } catch (error) {
        console.error("Failed to delete old banner from ImageKit:", error);
        // Continue with upload even if old file deletion fails
      }
    }

    // Upload new banner to ImageKit
    imagekit.upload({
      file: req.file.buffer,
      fileName: `banner-${user._id}-${Date.now()}`,
      folder: `/JEERA/banners`
    }, async (error, result) => {
      if (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({ message: "Failed to upload banner to ImageKit" });
      }

      try {
        // Update user with new banner info including fileId
        user.profileBanner = {
          url: result.url,
          fileId: result.fileId
        };
        await user.save();

        console.log("Banner uploaded successfully:", { fileId: result.fileId, url: result.url });
        res.status(200).json({
          message: "Banner uploaded successfully",
          banner: user.profileBanner
        });
      } catch (saveError) {
        console.error("Failed to save banner to database:", saveError);
        // Try to delete the uploaded file from ImageKit if save fails
        try {
          await imagekit.deleteFile(result.fileId);
          console.log("Cleaned up uploaded banner from ImageKit:", result.fileId);
        } catch (deleteError) {
          console.error("Failed to cleanup uploaded banner:", deleteError);
        }
        res.status(500).json({ message: "Failed to save banner to database" });
      }
    });
  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({ message: "Failed to upload banner" });
  }
});

// Upload profile picture
Router.post("/upload/profile-pic", upload.single('profilePic'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old profile picture file from ImageKit if exists
    if (user.profilePic?.fileId) {
      try {
        await imagekit.deleteFile(user.profilePic.fileId);
        console.log("Old profile picture deleted from ImageKit:", user.profilePic.fileId);
      } catch (error) {
        console.error("Failed to delete old profile picture from ImageKit:", error);
        // Continue with upload even if old file deletion fails
      }
    }

    // Upload new profile picture to ImageKit
    imagekit.upload({
      file: req.file.buffer,
      fileName: `profile-${user._id}-${Date.now()}`,
      folder: "/JEERA/profilePics"
    }, async (error, result) => {
      if (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({ message: "Failed to upload profile picture to ImageKit" });
      }

      try {
        // Update user with new profile picture info including fileId
        user.profilePic = {
          url: result.url,
          fileId: result.fileId
        };
        await user.save();

        console.log("Profile picture uploaded successfully:", { fileId: result.fileId, url: result.url });
        res.status(200).json({
          message: "Profile picture uploaded successfully",
          profilePic: user.profilePic
        });
      } catch (saveError) {
        console.error("Failed to save profile picture to database:", saveError);
        // Try to delete the uploaded file from ImageKit if save fails
        try {
          await imagekit.deleteFile(result.fileId);
          console.log("Cleaned up uploaded profile picture from ImageKit:", result.fileId);
        } catch (deleteError) {
          console.error("Failed to cleanup uploaded profile picture:", deleteError);
        }
        res.status(500).json({ message: "Failed to save profile picture to database" });
      }
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
});

// Upload project image
Router.post("/upload/project-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload project image to ImageKit
    imagekit.upload({
      file: req.file.buffer,
      fileName: `project-${Date.now()}-${req.file.originalname}`,
      folder: "/JEERA/projects"
    }, async (error, result) => {
      if (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({ message: "Failed to upload project image to ImageKit" });
      }

      try {
        console.log("Project image uploaded successfully:", { fileId: result.fileId, url: result.url });
        res.status(200).json({
          message: "Project image uploaded successfully",
          url: result.url,
          fileId: result.fileId
        });
      } catch (error) {
        console.error("Failed to save project image response:", error);
        res.status(500).json({ message: "Failed to save project image response" });
      }
    });
  } catch (error) {
    console.error("Project image upload error:", error);
    res.status(500).json({ message: "Failed to upload project image" });
  }
});

// Delete banner
Router.delete("/delete/banner", async (req, res) => {
  try {
    const user = req.user;

    if (user.profileBanner?.fileId) {
      // Delete file from ImageKit using fileId
      try {
        await imagekit.deleteFile(user.profileBanner.fileId);
        console.log("Banner deleted from ImageKit:", user.profileBanner.fileId);
      } catch (error) {
        console.error("Failed to delete banner file from ImageKit:", error);
        // Still proceed to remove from database even if ImageKit deletion fails
      }
    }

    // Remove banner from user profile
    user.profileBanner = undefined;
    await user.save();

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Banner delete error:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
});

// Delete profile picture
Router.delete("/delete/profile-pic", async (req, res) => {
  try {
    const user = req.user;

    if (user.profilePic?.fileId) {
      // Delete file from ImageKit using fileId
      try {
        await imagekit.deleteFile(user.profilePic.fileId);
        console.log("Profile picture deleted from ImageKit:", user.profilePic.fileId);
      } catch (error) {
        console.error("Failed to delete profile picture file from ImageKit:", error);
        // Still proceed to remove from database even if ImageKit deletion fails
      }
    }

    // Remove profile picture from user profile
    user.profilePic = undefined;
    await user.save();

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Profile picture delete error:", error);
    res.status(500).json({ message: "Failed to delete profile picture" });
  }
});

// Upload skill image
Router.post("/upload/skill-image", upload.single('skillImage'), async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old skill image file from ImageKit if exists
    if (user.skillImage?.fileId) {
      try {
        await imagekit.deleteFile(user.skillImage.fileId);
        console.log("Old skill image deleted from ImageKit:", user.skillImage.fileId);
      } catch (error) {
        console.error("Failed to delete old skill image from ImageKit:", error);
        // Continue with upload even if old file deletion fails
      }
    }

    // Upload new skill image to ImageKit
    imagekit.upload({
      file: req.file.buffer,
      fileName: `skill-${user._id}-${Date.now()}`,
      folder: "/JEERA/skills"
    }, async (error, result) => {
      if (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({ message: "Failed to upload skill image to ImageKit" });
      }

      try {
        // Update user with new skill image info including fileId
        user.skillImage = {
          url: result.url,
          fileId: result.fileId
        };
        await user.save();

        console.log("Skill image uploaded successfully:", { fileId: result.fileId, url: result.url });
        res.status(200).json({
          message: "Skill image uploaded successfully",
          skillImage: user.skillImage
        });
      } catch (saveError) {
        console.error("Failed to save skill image to database:", saveError);
        // Try to delete the uploaded file from ImageKit if save fails
        try {
          await imagekit.deleteFile(result.fileId);
          console.log("Cleaned up uploaded skill image from ImageKit:", result.fileId);
        } catch (deleteError) {
          console.error("Failed to cleanup uploaded skill image:", deleteError);
        }
        res.status(500).json({ message: "Failed to save skill image to database" });
      }
    });
  } catch (error) {
    console.error("Skill image upload error:", error);
    res.status(500).json({ message: "Failed to upload skill image" });
  }
});

// Delete skill image
Router.delete("/delete/skill-image", async (req, res) => {
  try {
    const user = req.user;

    if (user.skillImage?.fileId) {
      // Delete file from ImageKit using fileId
      try {
        await imagekit.deleteFile(user.skillImage.fileId);
        console.log("Skill image deleted from ImageKit:", user.skillImage.fileId);
      } catch (error) {
        console.error("Failed to delete skill image file from ImageKit:", error);
        // Still proceed to remove from database even if ImageKit deletion fails
      }
    }

    // Remove skill image from user profile
    user.skillImage = undefined;
    await user.save();

    res.status(200).json({ message: "Skill image deleted successfully" });
  } catch (error) {
    console.error("Skill image delete error:", error);
    res.status(500).json({ message: "Failed to delete skill image" });
  }
});

module.exports = Router;
