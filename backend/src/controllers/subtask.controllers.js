const mongoose = require("mongoose");
const SubtaskModel = require("../models/subtask.model");
const TaskModel = require("../models/task.model");
const taskHistoryModel = require("../models/taskHistory.model");
const projectModel = require("../models/project.model");

// Create subtask
async function createSubtask(req, res) {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo } = req.body;
    const userId = req.user._id;

    console.log("Creating subtask:", { taskId, title, description, assignedTo, userId });

    // Verify task exists and user has access
    const task = await TaskModel.findById(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user is project member
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      console.log("User not authorized:", userId, "Project members:", project.members);
      return res.status(403).json({ message: "Not authorized" });
    }

    const subtask = await SubtaskModel.create({
      title,
      description,
      parentTask: taskId,
      createdBy: userId,
      assignedTo
    });

    console.log("Subtask created:", subtask);

    // Create history entry (simplified)
    try {
      const history = await taskHistoryModel.create({
        task: taskId,
        user: userId,
        action: "Created subtask",
        newValue: title
      });

      // Add history to parent task
      task.history.push(history._id);
      await task.save();
      console.log("History created and added to task");
    } catch (historyError) {
      console.error("History creation failed:", historyError);
      // Continue without history - don't fail the whole operation
    }

    const populatedSubtask = await SubtaskModel.findById(subtask._id)
      .populate("createdBy", "username email profilePic")
      .populate("assignedTo", "username email profilePic")
      .populate("history");

    console.log("Populated subtask:", populatedSubtask);
    res.status(201).json({ subtask: populatedSubtask });
  } catch (error) {
    console.error("Create subtask error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all subtasks for a task
async function getSubtasks(req, res) {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    console.log("Getting subtasks for task:", taskId, "User:", userId);

    // Verify task exists and user has access
    const task = await TaskModel.findById(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user is project member
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      console.log("User not authorized:", userId);
      return res.status(403).json({ message: "Not authorized" });
    }

    const subtasks = await SubtaskModel.find({ parentTask: taskId })
      .populate("createdBy", "username email profilePic")
      .populate("assignedTo", "username email profilePic")
      .populate("history")
      .sort({ createdAt: -1 });

    console.log("Found subtasks:", subtasks);
    res.status(200).json({ subtasks });
  } catch (error) {
    console.error("Get subtasks error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Update subtask
async function updateSubtask(req, res) {
  try {
    const { taskId, subtaskId } = req.params;
    const { title, description, status, assignedTo } = req.body;
    const userId = req.user._id;

    // Verify subtask exists
    const subtask = await SubtaskModel.findById(subtaskId);
    if (!subtask || subtask.parentTask.toString() !== taskId) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Verify user is project member
    const task = await TaskModel.findById(taskId);
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let changed = false;
    let updates = [];

    // Track changes
    if (title && title !== subtask.title) {
      updates.push({
        action: "Updated subtask title",
        oldValue: subtask.title,
        newValue: title
      });
      subtask.title = title;
      changed = true;
    }

    if (description !== undefined && description !== subtask.description) {
      updates.push({
        action: "Updated subtask description",
        oldValue: subtask.description || "",
        newValue: description
      });
      subtask.description = description;
      changed = true;
    }

    if (status && status !== subtask.status) {
      updates.push({
        action: "Updated subtask status",
        oldValue: subtask.status,
        newValue: status
      });
      subtask.status = status;
      changed = true;
    }

    if (assignedTo && assignedTo !== subtask.assignedTo?.toString()) {
      updates.push({
        action: "Updated subtask assignee",
        oldValue: subtask.assignedTo?.toString() || "",
        newValue: assignedTo
      });
      subtask.assignedTo = assignedTo;
      changed = true;
    }

    if (changed) {
      // Create history entries for each update
      for (const update of updates) {
        const history = await taskHistoryModel.create({
          task: taskId,
          user: userId,
          action: update.action,
          oldValue: update.oldValue,
          newValue: update.newValue,
        });
        subtask.history.push(history._id);
      }

      await subtask.save();

      // Add history to parent task
      for (const update of updates) {
        const history = await taskHistoryModel.create({
          task: taskId,
          user: userId,
          action: update.action,
          oldValue: update.oldValue,
          newValue: update.newValue,
        });
        task.history.push(history._id);
      }
      await task.save();
    }

    const updatedSubtask = await SubtaskModel.findById(subtaskId)
      .populate("createdBy", "username email profilePic")
      .populate("assignedTo", "username email profilePic")
      .populate("history");

    res.status(200).json({ subtask: updatedSubtask });
  } catch (error) {
    console.error("Update subtask error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete subtask
async function deleteSubtask(req, res) {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user._id;

    // Verify subtask exists
    const subtask = await SubtaskModel.findById(subtaskId);
    if (!subtask || subtask.parentTask.toString() !== taskId) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Verify user is project member
    const task = await TaskModel.findById(taskId);
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create history entry
    const history = await taskHistoryModel.create({
      task: taskId,
      user: userId,
      action: "Deleted subtask",
      oldValue: subtask.title
    });

    // Add history to parent task
    task.history.push(history._id);
    await task.save();

    await SubtaskModel.findByIdAndDelete(subtaskId);

    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Delete subtask error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
  createSubtask,
  getSubtasks,
  updateSubtask,
  deleteSubtask
};
