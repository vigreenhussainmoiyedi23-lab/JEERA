const projectModel = require("../models/project.model");
const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");

function taskSocket(io, socket, socketIdMap) {
  // ✅ Create a new task
  socket.on(
    "createTask",
    async ({ projectId, title, description, assignedTo }) => {
      const createdBy = socket.user.id;
      const project = await projectModel.findById(projectId);
      // --- Authorization check ---
      const isAdmin = project.admin.toString() === createdBy.toString();
      const isCoAdmin = project.coAdmins.some(
        (co) => co.toString() === createdBy.toString()
      );

      if (!isAdmin && !isCoAdmin) {
        // User is not authorized to create a task
        return socket.to(socketIdMap(createdBy.toString())).emit("errorMessage", {
          message: "You are not authorized to create tasks in this project.",
        });
      }
      if (
        isCoAdmin &&
        project.coAdmins.some((co) => co.toString() == assignedTo.toString())
      ) {
        return socket.to(socketIdMap(createdBy.toString())).emit("errorMessage", {
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
      assignedTo.map(async (userid) =>
        await UserModel.findOneAndUpdate({ _id: userid }, { $push: { tasks: newTask._id } }, { new: true })
      )
      project.allTasks.push(newTask._id);
      await project.save();
      assignedTo.map(userid => {
        io.to(socketIdMap.get(userid)).emit("newTask", newTask);
      })
    }
  );

  // ✅ Update task status
  socket.on("updateTask", async ({ projectId, taskId, status }) => {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    updatedTask.assignedTo.map(userid => {
      io.to(socketIdMap.get(userid)).emit("taskUpdated", updatedTask);;
    })
  });
  socket.on("get-all-tasks", async ({projectId}) => {
    const user = await UserModel.findById(socket.user?.id).populate("tasks.task")
    socket.to(socketIdMap.get(user._id)).emit("all-tasks",{tasks:user.allTasks})
  });
}

module.exports = taskSocket;
