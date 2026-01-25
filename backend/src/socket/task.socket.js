const projectModel = require("../models/project.model");
const taskModel = require("../models/task.model");
const TaskModel = require("../models/task.model");
const taskHistoryModel = require("../models/taskHistory.model");
const UserModel = require("../models/user.model");
const runSocketValidator = require("../services/runSocketvalidator");
const { TaskValidator } = require("../utils/express-validator");

function taskSocket(io, socket, socketIdMap) {
  async function isProjectMember(projectId, userId) {
    const project = await projectModel.findById(projectId);
    if (!project) return false;

    return (
      project.members.some(m => m.member._id.toString() === userId.toString())
    );
  }
  function getEnumValues() {
    const schema = taskModel.schema;
    const enumFields = ["priority", "category", "taskStatus", "issueType"]; // fields you care about
    const enumValues = {};
    for (const field of enumFields) {
      const path = schema.path(field); // ✅ use dynamic field name
      if (path && path.enumValues && path.enumValues.length > 0) {
        enumValues[field] = path.enumValues;
      }
    }
    return enumValues
  }
  // Join project & send members
  socket.on("joinProject", async (projectId) => {
    try {
      const user = socket.user;
      if (!(await isProjectMember(projectId, user._id))) {
        return socket.emit("errorMessage", { message: "Access denied" });
      }

      socket.join(projectId.toString());

      const project = await projectModel
        .findById(projectId)
        .populate("members.member", "username email profilePic")
      const members = [
        ...project.members,
      ].filter(Boolean);

      socket.emit("projectMembers", members);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to join project" });
    }
  });
  socket.on("leaveProject", async (projectId) => {
    try {
      const user = socket.user;
      if (!(await isProjectMember(projectId, user._id))) {
        return socket.emit("errorMessage", { message: "Access denied" });
      }
      socket.leave(projectId.toString());
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to join project" });
    }
  });

  // CREATE TASK - now accepts taskStatus from client
  socket.on("createTask", async ({ taskDets, projectId }, ack) => {
    try {
      // Validate status
      const validStatuses = ["toDo", "Inprogress", "Inreview", "done", "Failed"];
      const finalStatus = validStatuses.includes(taskDets?.taskStatus) ? taskDets?.taskStatus : "toDo";
      taskDets.taskStatus = finalStatus
      const errors = await runSocketValidator(TaskValidator, taskDets);

      if (errors) {
        return ack({
          success: false,
          errors
        });
      }
      const createdBy = socket.user;
      const project = await projectModel.findById(projectId);
      if (!project) {
        return socket.emit("errorMessage", { message: "Project not found" });
      }

      if (!(await isProjectMember(projectId, createdBy._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }
      const newTask = await TaskModel.create({
        ...taskDets,
        createdBy: createdBy._id,
        project: projectId
      });
      await UserModel.updateMany(
        { _id: { $in: newTask.assignedTo } },
        { $push: { tasks: { task: newTask._id, project: projectId } } }
      );
      project.allTasks.push(newTask._id);
      await project.save();
      const populatedTask = await TaskModel.findById(newTask._id)
        .populate("createdBy", "username email profilePic")
        .populate("assignedTo", "username email profilePic");
      newTask.assignedTo.forEach(userId => {
        const socketIdSet = socketIdMap.get(userId.toString());
        if (!socketIdSet) return;
        const socketIds = [...socketIdSet];
        socketIds.forEach(sid => {
          // if (sid === socket.id) return;
          const targetSocket = io.sockets.sockets.get(sid);
          if (!targetSocket) return;

          if (targetSocket.rooms.has(projectId.toString())) {
            targetSocket.emit("taskCreated", {
              task: newTask,
              status: newTask.taskStatus
            });
          }
        });
      });
      // 🔁 respond ONLY via ack
      ack({
        success: true,
        newTask
      });

    } catch (err) {
      console.log("error occured", err)
      return ack({
        success: false,
        errors: err
      });
    }
  });

  // UPDATE TASK (status + other fields)
  socket.on("updateTask", async ({ taskId, status, assignedTo, projectId, category, priority, title, description, issueType }) => {
    try {
      const enumValues = getEnumValues()
      const task = await TaskModel.findById(taskId)
      const from = task.taskStatus
      if (!task) return socket.emit("errorMessage", { message: "Task not found" });

      if (!(await isProjectMember(task.project, socket.user._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }
      
      let changed = false;
      let updates = [];

      // Handle title update
      if (title && title !== task.title) {
        updates.push({
          action: "Updated Title",
          oldValue: task.title,
          newValue: title
        });
        task.title = title;
        changed = true;
      }

      // Handle description update
      if (description !== undefined && description !== task.description) {
        updates.push({
          action: "Updated Description",
          oldValue: task.description || "",
          newValue: description
        });
        task.description = description;
        changed = true;
      }

      if (status && enumValues.taskStatus.includes(status)) {
        updates.push({
          action: "Updated Status",
          oldValue: task.taskStatus,
          newValue: status
        });
        task.taskStatus = status;
        changed = true;
      }

      let prevAssignees = null;
      if (assignedTo && Array.isArray(assignedTo)) {
        prevAssignees = Array.isArray(task.assignedTo)
          ? task.assignedTo.map((id) => id.toString())
          : [];
        const nextAssignees = assignedTo.map((id) => id.toString());

        updates.push({
          action: "Updated assignedTo",
          oldValue: prevAssignees.join(","),
          newValue: nextAssignees.join(",")
        });
        task.assignedTo = assignedTo;
        changed = true;
      }
      
      if (priority && enumValues.priority.includes(priority)) {
        updates.push({
          action: "Updated Priority",
          oldValue: task.priority,
          newValue: priority
        });
        task.priority = priority;
        changed = true;
      }
      
      if (category && enumValues.category.includes(category)) {
        updates.push({
          action: "Updated Category",
          oldValue: task.category,
          newValue: category
        });
        task.category = category;
        changed = true;
      }

      if (issueType && enumValues.issueType.includes(issueType)) {
        updates.push({
          action: "Updated Issue Type",
          oldValue: task.issueType,
          newValue: issueType
        });
        task.issueType = issueType;
        changed = true;
      }

      if (changed) {
        // Create history entry for each update
        for (const update of updates) {
          const history = await taskHistoryModel.create({
            task: taskId,
            user: socket.user._id,
            action: update.action,
            oldValue: update.oldValue,
            newValue: update.newValue,
          });
          task.history.push(history._id);
        }
        
        await task.save();

        if (prevAssignees) {
          const nextAssignees = Array.isArray(assignedTo)
            ? assignedTo.map((id) => id.toString())
            : [];

          const removed = prevAssignees.filter((id) => !nextAssignees.includes(id));
          const added = nextAssignees.filter((id) => !prevAssignees.includes(id));

          if (removed.length > 0) {
            await UserModel.updateMany(
              { _id: { $in: removed } },
              { $pull: { tasks: { task: task._id } } },
            );
          }

          if (added.length > 0) {
            await UserModel.updateMany(
              { _id: { $in: added } },
              { $push: { tasks: { task: task._id, project: task.project } } },
            );
          }
        }

        const updatedTask = await TaskModel.findById(taskId)
          .populate("createdBy", "username email profilePic")
          .populate("assignedTo", "username email profilePic")
          .populate({ path: "history", populate: { path: "user", select: "username email profilePic" } });
        
        task.assignedTo.forEach(userId => {
          const socketIds = socketIdMap.get(userId.toString());
          if (!socketIds) return;

          socketIds.forEach(sid => {
            if (sid === socket.id) return;
            const targetSocket = io.sockets.sockets.get(sid);
            if (!targetSocket) return;
            if (targetSocket.rooms.has(projectId.toString())) {
              targetSocket.emit("taskUpdated", {
                task: updatedTask,
                from,
                to: status
              });
            }
          });
        });
      }
    } catch (err) {
      console.error("Update task error:", err);
      socket.emit("errorMessage", { message: "Failed to update task" });
    }
  });

  // GET ALL TASKS
  socket.on("getAllTasks", async (projectId) => {
    try {
      if (!(await isProjectMember(projectId, socket.user._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }

      // Get project to check user role
      const project = await projectModel.findById(projectId);
      if (!project) {
        return socket.emit("errorMessage", { message: "Project not found" });
      }

      // Check if user is admin or coAdmin
      const userMember = project.members.find(
        m => m.member._id.toString() === socket.user._id.toString()
      );
      const isAdminOrCoAdmin = userMember && ["admin", "coAdmin"].includes(userMember.role);

      let tasks;
      if (isAdminOrCoAdmin) {
        // Admin and coAdmin can see all tasks
        tasks = await TaskModel.find({ project: projectId })
          .populate("createdBy", "username email profilePic")
          .populate("assignedTo", "username email profilePic")
          .populate({ path: "history", populate: { path: "user", select: "username email profilePic" } })
          .sort({ createdAt: -1 });
      } else {
        // Regular users only see tasks assigned to them
        tasks = await TaskModel.find({ 
          project: projectId,
          assignedTo: socket.user._id 
        })
          .populate("createdBy", "username email profilePic")
          .populate("assignedTo", "username email profilePic")
          .populate({ path: "history", populate: { path: "user", select: "username email profilePic" } })
          .sort({ createdAt: -1 });
      }

      socket.emit("allTasks", tasks);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to load tasks" });
    }
  });
  // DELETE TASK (admin only)
  socket.on("deleteTask", async ({ taskId, projectId }, ack) => {
    try {
      if (!(await isProjectMember(projectId, socket.user._id))) {
        return socket.emit("errorMessage", { message: "Not authorized" });
      }

      // Check if user is admin
      const project = await projectModel.findById(projectId);
      if (!project) {
        return socket.emit("errorMessage", { message: "Project not found" });
      }

      const userMember = project.members.find(
        m => m.member._id.toString() === socket.user._id.toString()
      );
      const isAdmin = userMember && userMember.role === "admin";

      if (!isAdmin) {
        return socket.emit("errorMessage", { message: "Only admin can delete tasks" });
      }

      const task = await TaskModel.findById(taskId);
      if (!task) {
        return socket.emit("errorMessage", { message: "Task not found" });
      }

      // Remove task from project
      project.allTasks = project.allTasks.filter(id => id.toString() !== taskId);
      await project.save();

      // Remove task from assigned users' task lists
      await UserModel.updateMany(
        { _id: { $in: task.assignedTo } },
        { $pull: { tasks: { task: taskId } } }
      );

      // Delete the task
      await TaskModel.findByIdAndDelete(taskId);

      // Notify all project members
      io.to(projectId.toString()).emit("taskDeleted", { taskId });

      if (ack) {
        ack({ success: true });
      }
    } catch (err) {
      console.error("Delete task error:", err);
      socket.emit("errorMessage", { message: "Failed to delete task" });
      if (ack) {
        ack({ success: false, error: err.message });
      }
    }
  });

  socket.on("getAllEnums", async (projectId) => {
    try {
      const enumValues = getEnumValues()

      const project = await projectModel.findById(projectId)
        .populate("members.member", "username email profilePic")

      const assignedToEnum = [...project.members]

      enumValues.assignedTo = assignedToEnum
      socket.emit("allEnums", enumValues);
    } catch (err) {
      console.error(err);
      socket.emit("errorMessage", { message: "Failed to load enums" });
    }
  });

}

module.exports = taskSocket;