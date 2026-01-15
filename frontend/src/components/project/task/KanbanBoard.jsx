import { useState, useCallback, useEffect } from "react";
import KanbanColumn from "./KanbanColumn.jsx";
import socket from "../../../socket/socket.js";
const columns = [
  { id: "toDo", label: "To Do" },
  { id: "inProgress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
  { id: "Failed", label: "Failed" },
];

export default function KanbanBoard({ projectId, currentUser }) {
  const [enumValues, setEnumValues] = useState(null)
  const [tasks, setTasks] = useState({
    todo: [],
    done: [],
    review: [],
    inProgress: [],
    Failed: [],
  });
  //stores the tasks from backend

  const [dragState, setDragState] = useState(null);
  //stores the task being dragged , its coloumn ,its index

  const [dropIndicator, setDropIndicator] = useState(null);
  //STORES THE COLOUMN ID WHERE THE TASK NEEDS TO BE DROPPED AND THE INDEX

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
  const createTaskHandler = useCallback(() => {}, []);

  const handleDrop = useCallback(
    (e, targetColumnId) => {
      e.preventDefault();
      if (!dragState || !dropIndicator) {
        handleDragEnd(); //resets value to null
        return;
      }
      console.log(targetColumnId);
      socket.emit("updateTask", {
        taskId: task._id,
        status: targetColumnId,
        assignedTo: task.assignedTo,
      });
      const { task, fromColumnId, fromIndex } = dragState;
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
        Math.min(targetIndex, newTasks[targetColumnId].length)
      );
      newTasks[targetColumnId].splice(targetIndex, 0, task);

      setTasks(newTasks);
      handleDragEnd();
    },
    [dragState, dropIndicator, tasks, handleDragEnd]
  );
  useEffect(() => {
    socket.emit("getAllTasks", projectId);
    socket.emit("getAllEnums",projectId);
    socket.on("allEnums", (enumvalues) => {
      console.log("got enumvalues",enumvalues)
      setEnumValues(enumvalues)
    });
    socket.on("allTasks", (AllTasks) => {
      const tasksByStatus = {
        todo: [],
        done: [],
        review: [],
        inProgress: [],
        Failed: [],
      };
      AllTasks.map((t) => {
        tasksByStatus[t.taskStatus].push(t);
      });
      console.log(tasksByStatus);
    });
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Project Board</h1>
        <p className="text-gray-400">
          Drag and drop tasks to manage your workflow
        </p>
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
          />
        ))}
      </div>
    </div>
  );
}
