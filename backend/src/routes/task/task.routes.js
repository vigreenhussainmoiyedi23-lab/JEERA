const express = require("express");
const taskModel = require("../../models/task.model");
const subtaskRoutes = require("../subtask.routes");
const taskChatRoutes = require("../taskChat.routes");
const Router = express.Router()

// /api/task
Router.get("/more/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params
        // console.log(taskId)
        const task = await taskModel.findById(taskId)
            .populate("createdBy", "username email profilePic")
            .populate("assignedTo", "username email profilePic")
            .populate({ path: "history", populate: { path: "user", select: "username email profilePic" } });
        //   console.log(task)
        if (!task) return res.status(400).json({ message: "Task Doesnt exists" })
        res.status(200).json({ message: "task details", task })
    } catch (error) {
        res.status(500).json({ message: "Error occured", error })
    }
}
);

// Mount subtask routes
Router.use("/:taskId/subtasks", subtaskRoutes);

// Mount task chat routes
Router.use("/:taskId/chat", taskChatRoutes);

module.exports = Router