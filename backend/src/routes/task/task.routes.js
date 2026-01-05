const express = require("express")
const Router = express.Router()
// /api/task
Router.post("/create", async (req, res) => {
    const { projectId, title, description, assignedTo } = req.body
    const createdBy = socket.user.id;
    const project = await projectModel.findById(projectId);
    // --- Authorization check ---
    const isAdmin = project.admin.toString() === createdBy.toString();
    const isCoAdmin = project.coAdmins.some(
        (co) => co.toString() === createdBy.toString()
    );

    if (!isAdmin && !isCoAdmin) {
        // User is not authorized to create a task
        return res.status(400).json({
            message: "You are not authorized to create tasks in this project.",
        });
    }
    if (
        isCoAdmin &&
        project.coAdmins.some((co) => co.toString() == assignedTo.toString())
    ) {
        return socket.emit("errorMessage", {
            message:
                "You are not authorized to give tasks to coadmins in this project.",
        });
    }
    const newTask = await TaskModel.create({
        title,
        description,
        assignedTo,
        createdBy,
        status: "inProgress",
    });
    project.allTasks.push(newTask._id);
    user.tasks.push(newTask._id);
    await project.save();
    await user.save();
    io.to(newTask._id).emit("newTask", newTask);
}
);

module.exports = Router