const express = require("express");
const Router = express.Router();


// requiring middlewares
const { ProjectValidator, validate } = require("../../utils/express-validator");
const adminRoutes=require("../project/admin.routes")

const projectModel = require("../../models/project.model");
const UserModel = require("../../models/user.model");
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
    await user.save()
    return res.status(200).json({
      message: "project created successfully! add members and give tasks",
      project
    });
  } catch (error) {
    return res.status(500).json({
      message: "project creation failed",
      error,
    });
  }
});
Router.get("/more/:projectid",async (req,res)=>{

  try {
const {projectid}=req.params
  const user=await UserModel.findById(req.user._id).populate({path:"tasks.task",match:{"project":projectid}})
  const project=await projectModel.findById(projectid).populate("admin").populate("coAdmins.coAdmin").populate("members.member")
  const status=(user.projects.find(f=>f.project.toString()===projectid.toString())).status
  return res.status(200).json({message:"all user tasks",user,project,status})
} catch (error) {
  return res.status(500).json({message:"Something Went Wrong",error})
}
})
Router.use("/admin",adminRoutes)



module.exports = Router;
