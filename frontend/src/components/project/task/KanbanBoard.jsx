import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import socket from "../../../socket/socket";

// --- 🧱 Sortable Column Wrapper ---
function SortableColumn({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// --- 📋 Sortable Task Card ---
function SortableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-gray-900/70 border border-gray-700 rounded-lg p-3 mb-3 cursor-grab active:cursor-grabbing text-yellow-200 hover:border-yellow-400 transition"
    >
      <h3 className="font-semibold text-sm">{task.title}</h3>
      <p className="text-xs text-gray-400 line-clamp-2 mb-1">
        {task.description}
      </p>
      <p className="text-xs text-gray-500">
        👤 {task.createdBy?.username || "Unknown"}
      </p>
    </div>
  );
}

export default function KanbanBoard({ projectId, currentUser }) {
  const [tasks, setTasks] = useState([
    {
      title: "Design Login Page UI",
      description: "Create responsive login and signup UI using Tailwind CSS",
      categoury: "frontend",
      priority: "high",
      status: "pending",
      assignedTo: ["65f12a1b9c1a2e0012a11111"],
      createdBy: "65f129f99c1a2e0012a00001",
      dueDate: new Date("2026-01-20"),
    },
    {
      title: "JWT Authentication API",
      description:
        "Implement JWT-based authentication with access and refresh tokens",
      categoury: "backend",
      priority: "high",
      status: "Failed",
      assignedTo: ["65f12a1b9c1a2e0012a11112", "65f12a1b9c1a2e0012a11113"],
      createdBy: "65f129f99c1a2e0012a00001",
      dueDate: new Date("2026-01-18"),
    },
    {
      title: "Fix Navbar Bug",
      description: "Navbar breaks on mobile view below 375px width",
      categoury: "frontend",
      priority: "medium",
      status: "Failed",
      assignedTo: ["65f12a1b9c1a2e0012a11114"],
      createdBy: "65f129f99c1a2e0012a00002",
      dueDate: new Date("2026-01-10"),
    },
    {
      title: "Database Index Optimization",
      description: "Add indexes to frequently queried fields for performance",
      categoury: "backend",
      priority: "medium",
      status: "toDo",
      assignedTo: ["65f12a1b9c1a2e0012a11115"],
      createdBy: "65f129f99c1a2e0012a00001",
      dueDate: new Date("2026-01-25"),
    },
    {
      title: "Deploy Backend to Render",
      description:
        "Deploy Node.js backend with environment variables configured",
      categoury: "devops",
      priority: "high",
      status: "Inprogress",
      assignedTo: ["65f12a1b9c1a2e0012a11116"],
      createdBy: "65f129f99c1a2e0012a00003",
      dueDate: new Date("2026-01-15"),
    },
    {
      title: "Write API Documentation",
      description: "Document all REST APIs using Swagger",
      categoury: "documentation",
      priority: "low",
      status: "done",
      assignedTo: ["65f12a1b9c1a2e0012a11117"],
      createdBy: "65f129f99c1a2e0012a00001",
      dueDate: new Date("2026-01-30"),
    },
  ]);
  const [columns, setColumns] = useState([
    { id: "toDo", label: "To Do", Bgcolor: "bg-yellow-500" },
    { id: "Inprogress", label: "In Progress", Bgcolor: "bg-slate-500" },
    { id: "Inreview", label: "Review", Bgcolor: "bg-blue-500" },
    { id: "done", label: "Done", Bgcolor: "bg-green-500" },
    { id: "Failed", label: "Failed", Bgcolor: "bg-red-500" },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: [],
    taskStatus: "toDo",
  });
  const [activeDragElem, setActiveDragElem] = useState(null);
  // 📡 Socket setup
  useEffect(() => {
    if (!projectId) return;

    socket.emit("joinProject", projectId);
    socket.emit("getAllTasks", projectId);

    socket.on("newTask", (task) => setTasks((prev) => [task, ...prev]));
    socket.on("taskUpdated", (updatedTask) =>
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      )
    );

    return () => socket.off();
  }, [projectId]);

  if (!tasks || tasks.length == 0) {
  }
  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {columns.map((c, idx) => {
          return (
            <div
              id={c.id}
              className="px-3 py-2 bg-slate-800 flex flex-col gap-3"
              onDrop={async function (e) {
                console.log(e);
              }}
            >
              <h1 className="text-yellow-300 font-bold text-2xl text-center mb-3">
                {c.label}
              </h1>
              {tasks.map((t) => {
                if (c.id==t.status) return (
                  <div
                    draggable
                    className={`${c.Bgcolor}  rounded-xl flex items-center justify-center flex-col h-40 w-full`}
                  >
                    <div className="flex items-center justify-between text-sm h-10">
                      <div>{t.status}</div>
                      <div>{new Date(t.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="h-20">
                      <h1 className="text-xl font-bold text-sky-200 p-2">{t.title}</h1>
                      <p className="w-full h-3/4 overflow-clip">{t.description}</p>
                    </div>
                    <div className="flex items-center justify-between h-10">
                      <div>{t.categoury}</div>
                      <div>{t.priority}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
