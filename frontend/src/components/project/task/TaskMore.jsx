// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "../../../utils/axiosInstance";
// const TaskMore = ({ task, onClose, socket ,enumValues }) => {
//   // enumValues are the all enum values like category= enumvalues.category assignedto and status

//   const { data, isLoading, isError, error, refetch } = useQuery({
//     // queryKey: ["taskMore",task],
//     queryFn: async () => (await axiosInstance.get(`/task/more/${task}`)).data.task,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//     enabled: !!task,

//   });
//   if (isLoading || isError) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//         {isLoading && <p>Loading Task Details</p>}
//         {isError && (
//           <>
//             <p>Loading Task Details</p>
//             <button onClick={refetch}>Retry</button>
//           </>
//         )}
//       </div>
//     );
//   }
//   return (
//     <div
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-[#0F1726] text-white rounded-2xl shadow-xl w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto p-6"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">{data?.title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white text-xl"
//           >
//             ✕
//           </button>
//         </div>

//         <p className="text-gray-300 mb-4">{data?.description}</p>

//         <div className="grid grid-cols-2 gap-3 mb-6">
//           <div>
//             <p className="text-sm text-gray-400">Issue Type</p>
//             <p className="font-medium capitalize">{data?.issueType}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-400">Priority</p>
//             <p className="font-medium capitalize">{data?.priority}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-400">Status</p>
//             <p className="font-medium capitalize">{data?.taskStatus}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-400">Category</p>
//             <p className="font-medium capitalize">{data?.category}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-400">Story Points</p>
//             <p className="font-medium">{data?.storyPoints ?? "-"}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-400">Due Date</p>
//             <p className="font-medium">
//               {data?.dueDate
//                 ? new Date(data.dueDate).toLocaleDateString()
//                 : "-"}
//             </p>
//           </div>
//         </div>

//         {/* History Section */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">History</h3>
//           {data?.history?.length > 0 ? (
//             <ul className="space-y-2">
//               {data.history.map((entry, idx) => {
//                 console.log(entry);
//                 return (
//                   <li
//                     key={idx}
//                     className="bg-[#1a253a] p-3 rounded-lg text-sm text-gray-300"
//                   >
//                     <p>
//                       <span className="text-gray-400">Action:</span>{" "}
//                       {entry.action}
//                     </p>
//                     <p>
//                       <span className="text-gray-400">By:</span>{" "}
//                       {entry.user?.username}
//                     </p>
//                     <p>
//                       <span className="text-gray-400">Date:</span>{" "}
//                       {new Date(entry.createdAt).toLocaleString()}
//                     </p>
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-gray-400 italic">No history recorded</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskMore;
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import MultipleSelectCheckmarks from "./DarkMultiSelect";

function TaskMore({ taskId, onClose, socket, enumValues }) {
  const queryClient = useQueryClient();
  console.log(enumValues, taskId);
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
    staleTime: 5 * 60 * 1000,
  });

  // Optimistic UI state
  const [status, setStatus] = useState(task?.taskStatus ?? "toDo");
  const [category, setCategory] = useState(task?.category ?? "");
  const [assignees, setAssignees] = useState(
    task?.assignedTo?.map((u) => u._id) ?? [],
  );

  useEffect(() => {
    if (task) {
      setStatus(task.taskStatus ?? "toDo");
      setCategory(task.category ?? "");
      setAssignees(task.assignedTo?.map((u) => u._id) ?? []);
    }
  }, [task]);

  // Listen to real-time updates
  useEffect(() => {
    if (!socket || !taskId) return;

    const handleTaskUpdated = ({ task: updatedTask }) => {
      if (updatedTask._id === taskId) {
        queryClient.setQueryData(["task", taskId], updatedTask);
      }
    };

    socket.on("taskUpdated", handleTaskUpdated);

    return () => {
      socket.off("taskUpdated", handleTaskUpdated);
    };
  }, [socket, taskId, queryClient]);

  const sendUpdate = (changes) => {
    if (!socket || !task) return;
    socket.emit("updateTask", {
      taskId: task._id,
      projectId: task.project,
      ...changes,
    });
  };
  const handleMultiChange = (event) => {
    const {
      target: { value },
    } = event;

    setAssignees((prev) => {
      const assigned = typeof value === "string" ? value.split(",") : value;
      const newData = [...prev, assigned];
      checkSubmission(newData); // ← fresh data
      return newData;
    });
  };
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    sendUpdate({ status: value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    sendUpdate({ category: value });
  };

  const handleAssigneesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setAssignees(selected);
    sendUpdate({ assignedTo: selected });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
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

            <div className="mb-4 md:mb-0">
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
              <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 capitalize">
                {task.issueType || "—"}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Priority
              </label>
              <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 capitalize">
                {task.priority || "—"}
              </div>
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
