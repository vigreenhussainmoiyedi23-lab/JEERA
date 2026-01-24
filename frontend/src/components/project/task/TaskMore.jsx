import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import MultipleSelectCheckmarks from "./DarkMultiSelect";

function TaskMore({ taskId, onClose, socket, enumValues, setTasks }) {
  const queryClient = useQueryClient();

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/task/more/${taskId}`);
      return data.task;
    },
    enabled: !!taskId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [status, setStatus] = useState("toDo");
  const [category, setCategory] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [priority, setPriority] = useState("");
  const [issueType, setIssueType] = useState("");

  // Sync form state when task data arrives / updates
  useEffect(() => {
    if (!task) return;
    console.log(`status ${task.taskStatus}`);
    setStatus(task.taskStatus ?? "toDo");
    setCategory(task.category ?? "");
    setPriority(task.priority ?? "");
    setIssueType(task.issueType ?? "");
    setAssignees(task.assignedTo?.map((u) => u._id) ?? []);
  }, [task]);

  // ────────────────────────────────────────────────
  //  Helper: optimistic update in kanban columns
  // ────────────────────────────────────────────────
  const optimisticKanbanUpdate = (updaterFn) => {
    setTasks((prevColumns) => {
      const columns = { ...prevColumns };

      // Find where the task currently lives
      let currentStatus = null;
      let taskIndex = -1;

      for (const [colStatus, tasks] of Object.entries(columns)) {
        const idx = tasks.findIndex(
          (t) => t?._id?.toString() === taskId?.toString(),
        );
        if (idx !== -1) {
          currentStatus = colStatus;
          taskIndex = idx;
          break;
        }
      }

      if (currentStatus === null || taskIndex === -1) {
        return columns; // task not found in kanban → skip
      }

      // Create updated version (never mutate original)
      const oldTask = { ...columns[currentStatus][taskIndex] };
      const updatedTask = updaterFn(oldTask);

      // Remove from current column
      columns[currentStatus] = [
        ...columns[currentStatus].slice(0, taskIndex),
        ...columns[currentStatus].slice(taskIndex + 1),
      ];

      // Target status (usually same unless status changed)
      const targetStatus = updatedTask.taskStatus ?? currentStatus;

      // Add / replace in target column
      const targetList = columns[targetStatus] ?? [];
      const existingIdx = targetList.findIndex(
        (t) => t._id?.toString() === taskId?.toString(),
      );

      if (existingIdx !== -1) {
        // replace
        columns[targetStatus] = [
          ...targetList.slice(0, existingIdx),
          updatedTask,
          ...targetList.slice(existingIdx + 1),
        ];
      } else {
        // append
        columns[targetStatus] = [...targetList, updatedTask];
      }

      return columns;
    });
  };

  // ────────────────────────────────────────────────
  //  Real-time socket listener
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !taskId) return;

    const handleTaskUpdated = ({ task: updatedServerTask }) => {
      if (updatedServerTask._id !== taskId) return;

      // Update detail view cache
      queryClient.setQueryData(["task", taskId], updatedServerTask);

      // Also reflect in kanban (authoritative source)
      optimisticKanbanUpdate(() => updatedServerTask);
    };

    socket.on("taskUpdated", handleTaskUpdated);
    return () => socket.off("taskUpdated", handleTaskUpdated);
  }, [socket, taskId, queryClient]);

  const sendUpdate = (changes) => {
    if (!socket || !task?._id) {
      console.warn("Cannot send update: missing socket or task");
      return;
    }
    socket.emit("updateTask", {
      taskId: task._id,
      projectId: task.project,
      ...changes,
    });
  };

  // ────────────────────────────────────────────────
  //  Handlers
  // ────────────────────────────────────────────────
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    optimisticKanbanUpdate((old) => ({
      ...old,
      taskStatus: newStatus,
    }));

    sendUpdate({ status: newStatus }); // backend accepts "status"
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    optimisticKanbanUpdate((old) => ({
      ...old,
      category: value,
    }));

    sendUpdate({ category: value });
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setPriority(value);

    optimisticKanbanUpdate((old) => ({
      ...old,
      priority: value,
    }));

    sendUpdate({ priority: value });
  };

  const handleIssueChange = (e) => {
    const value = e.target.value;
    setIssueType(value);

    optimisticKanbanUpdate((old) => ({
      ...old,
      issueType: value,
    }));

    sendUpdate({ issueType: value });
  };

  const handleMultiChange = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    setAssignees(value);

    optimisticKanbanUpdate((old) => ({
      ...old,
      assignedTo: value, // assuming backend wants array of user IDs
    }));

    sendUpdate({ assignedTo: value });
  };

  // ────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 text-slate-300 px-10 py-8 rounded-2xl border border-slate-700 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading task...</span>
        </div>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 text-slate-300 px-10 py-8 rounded-2xl border border-slate-700 text-center">
          <p className="mb-4 text-lg">Could not load task details</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-start justify-center z-50 pt-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-950/50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-slate-500 font-mono text-sm tracking-tight">
              {task.key || task._id.slice(-8).toUpperCase()}
            </span>
            <h2 className="text-xl font-semibold text-white truncate">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Main content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-slate-300 font-medium mb-2">Description</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-slate-200 min-h-[90px] whitespace-pre-wrap">
              {task.description || (
                <span className="text-slate-500 italic">
                  No description provided.
                </span>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {enumValues.taskStatus.map((s) => (
                  <option key={s} value={s}>
                    {s === "Inprogress" ? "In Progress" : s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {enumValues.category.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-start justify-center mb-5">
             
              <MultipleSelectCheckmarks
                changehandler={handleMultiChange}
                names={enumValues.assignedTo}
                assignedTo={assignees}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={handleIssueChange}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {enumValues.issueType.map((s) => (
                  <option key={s} value={s}>
                    {s === "" ? "select" : s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={handlePriorityChange}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {enumValues.priority.map((s) => (
                  <option key={s} value={s}>
                    {s === "" ? "select" : s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Story Points
              </label>
              <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200">
                {task.storyPoints ?? "—"}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
            {task.history?.length > 0 ? (
              <div className="space-y-4">
                {task.history.map((entry) => (
                  <div
                    key={entry._id}
                    className="bg-slate-800/40 rounded-lg p-4 border-l-4 border-blue-600/50 text-sm"
                  >
                    <div className="flex justify-between text-slate-400 text-xs mb-2">
                      <span>{new Date(entry.createdAt).toLocaleString()}</span>
                      <span className="font-medium">
                        {entry.user?.username}
                      </span>
                    </div>
                    <div className="text-slate-200">
                      {entry.action}
                      {entry.oldValue && entry.newValue && (
                        <span className="ml-2">
                          <span className="text-slate-300">
                            {entry.oldValue}
                          </span>
                          {" → "}
                          <span className="text-slate-100 font-medium">
                            {entry.newValue}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskMore;
