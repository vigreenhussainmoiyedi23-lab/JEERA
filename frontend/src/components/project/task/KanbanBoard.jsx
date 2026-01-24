import { useState, useCallback, useEffect } from "react";
import KanbanColumn from "./KanbanColumn.jsx";
import socket from "../../../socket/socket.js";
const columns = [
  { id: "toDo", label: "To Do" },
  { id: "Inprogress", label: "In Progress" },
  { id: "Inreview", label: "Review" },
  { id: "done", label: "Done" },
  { id: "Failed", label: "Failed" },
];

export default function KanbanBoard({ projectId, currentUser }) {
  const [enumValues, setEnumValues] = useState(null);
  const [tasks, setTasks] = useState({
    toDo: [],
    done: [],
    Inreview: [],
    Inprogress: [],
    Failed: [],
  });
  //stores the tasks from backend

  //stores the task being dragged , its coloumn ,its index
  const [dragState, setDragState] = useState(null);

  //STORES THE COLOUMN ID WHERE THE TASK NEEDS TO BE DROPPED AND THE INDEX
  const [dropIndicator, setDropIndicator] = useState(null);
  const handleDragStart = useCallback((task, columnId, index) => {
    setDragState({ task, fromColumnId: columnId, fromIndex: index });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropIndicator(null);
  }, []);

  const handleDragOver = useCallback((e, columnId, index) => {
    e.preventDefault();
    setDropIndicator((prev) => {
      if (prev?.columnId === columnId && prev?.index === index) return prev;
      return { columnId, index };
    });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropIndicator(null);
  }, []);
  const createTaskHandler = useCallback((TaskDets, status) => {
    try {
      TaskDets.taskStatus = status;
      TaskDets.labels = TaskDets.labels.split(",");
      socket.emit(
        "createTask",
        { taskDets: TaskDets, projectId },
        (response) => {
          if (!response.success) {
            console.error("an error occured" + response.errors);
            alert(response.errors[0]?.message);
            return;
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  }, [projectId]);

  const handleDrop = useCallback(
    (e, targetColumnId) => {
      e.preventDefault();
      if (!dragState || !dropIndicator) {
        handleDragEnd(); //resets value to null
        return;
      }
      const { task, fromColumnId, fromIndex } = dragState;
      if (targetColumnId !== fromColumnId) {
        socket.emit("updateTask", {
          taskId: task._id,
          status: targetColumnId,
          projectId,
        });
      }

      let targetIndex = dropIndicator.index;
      const newTasks = { ...tasks };
      newTasks[fromColumnId] = [...newTasks[fromColumnId]];
      newTasks[fromColumnId].splice(fromIndex, 1);

      if (fromColumnId === targetColumnId && fromIndex < targetIndex) {
        targetIndex = targetIndex - 1;
      }

      newTasks[targetColumnId] = [...newTasks[targetColumnId]];
      targetIndex = Math.max(
        0,
        Math.min(targetIndex, newTasks[targetColumnId].length),
      );
      newTasks[targetColumnId].splice(targetIndex, 0, task);
      setTasks(newTasks);
      handleDragEnd();
    },
    [dragState, dropIndicator, tasks, handleDragEnd],
  );

  useEffect(() => {
    // Ensure this view is in the project room so realtime emits (taskCreated/taskUpdated)
    // reach this socket without requiring a manual refresh.
    socket.emit("joinProject", projectId);

    socket.emit("getAllTasks", projectId);
    socket.on("taskCreated", ({ task, status }) => {
      // console.log("new task")
      setTasks((prev) => {
        return {
          ...prev,
          [status]: [...prev[status], task],
        };
      });
    });

    socket.emit("getAllEnums", projectId);
    socket.on("allEnums", (enumvalues) => {
      setEnumValues(enumvalues);
    });
    socket.on("errorMessage", (message) => {
      console.log("error fetching enum", message);
    });

    socket.on("allTasks", (AllTasks) => {
      const tasksByStatus = {
        toDo: [],
        done: [],
        Inreview: [],
        Inprogress: [],
        Failed: [],
      };
      AllTasks.map((t) => {
        tasksByStatus[t.taskStatus].push(t);
      });

      setTasks(tasksByStatus);
    });
    socket.on("taskUpdated", ({ task, from, to }) => {
      console.log("task update hua")
      setTasks((prev) => {
        const next = { ...prev };
        next[from] = [...next[from]];
        next[to] = [...next[to]];
        let AlreadyExists = next[to].findIndex(
          (t) => t._id.toString() == task._id.toString(),
        );
        if (AlreadyExists !== -1) {
          console.log("already exist");
          return prev;
        }
        let idx = next[from].findIndex(
          (t) => t._id.toString() == task._id.toString(),
        );
        next[from].splice(idx, 1);
        next[to].push(task);

        return next;
      });
    });
    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("allTasks");
      socket.off("allEnums");
      socket.off("errorMessage");
    };
  }, [projectId]);
  return (
    <div className="w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Project Board</h1>
        <div className="flex flex-col gap-4 text-slate-200">
          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-4 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-black font-bold">
              1
            </div>

            <div>
              <h1 className="font-semibold text-2xl text-slate-100">Drag & Drop Tasks</h1>
              <p className="text-sm text-slate-400">
                Organize and manage your workflow easily using drag and drop.
                <span className="block text-xs text-slate-500 mt-1">
                  Available on desktop & laptops only
                </span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-4 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-black font-bold">
              2
            </div>

            <div>
              <h1 className="font-semibold text-2xl text-slate-100">tap a Task to Edit</h1>
              <p className="text-sm text-slate-400">
                Open detailed task view to update status, priority, or details.
                <span className="block text-xs text-slate-500 mt-1">
                  Best for mobile & tablets
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-nowrap overflow-x-auto ">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks[column.id]}
            dragState={dragState}
            dropIndicator={dropIndicator}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            createTaskHandler={createTaskHandler}
            enumValues={enumValues}
            socket={socket}
            setTasks={setTasks}
          />
        ))}
      </div>
    </div>
  );
}
