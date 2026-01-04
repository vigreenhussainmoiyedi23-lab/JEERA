const express = require("express");
const Router = express.Router();


// requiring middlewares
const { ProjectValidator, validate } = require("../../utils/express-validator");
const projectModel = require("../../models/project.model");
// any user can create project 
Router.post("/create", ProjectValidator, validate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.user;

    const project=await projectModel.create({
      title,
      description: description || "",
      admin: user._id,
    });
    user.projects.push({
      project:project._id,
      status:"admin"
    })
    return res.status(200).json({
      message: "project created successfully! add members and give tasks",
    });
  } catch (error) {
    return res.status(500).json({
      message: "project creation failed",
      error,
    });
  }
});





module.exports = Router;
