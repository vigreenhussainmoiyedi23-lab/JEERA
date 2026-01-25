import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import MultipleSelectCheckmarks from "./DarkMultiSelect";
import { X, Save, MessageSquare, CheckSquare, Trash2, Edit3, Clock, User, Calendar, Flag } from "lucide-react";

function TaskMoreJira({ taskId, onClose, socket, enumValues, setTasks, currentUserRole, currentUserId }) {
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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "toDo",
    category: "",
    assignees: [],
    priority: "",
    issueType: "",
  });

  // Track if form has unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editing states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  // Modal states
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [showTaskChat, setShowTaskChat] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("details");

  // Sync form state when task data arrives
  useEffect(() => {
    if (!task) return;
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.taskStatus ?? "toDo",
      category: task.category ?? "",
      assignees: task.assignedTo?.map((u) => u._id) ?? [],
      priority: task.priority ?? "",
      issueType: task.issueType ?? "",
    });
    setHasUnsavedChanges(false);
  }, [task]);

  // Socket listener for real-time updates
  useEffect(() => {
    if (!socket || !taskId) return;

    const handleTaskUpdated = ({ task: updatedServerTask }) => {
      if (updatedServerTask._id !== taskId) return;
      queryClient.setQueryData(["task", taskId], updatedServerTask);
    };

    socket.on("taskUpdated", handleTaskUpdated);
    return () => socket.off("taskUpdated", handleTaskUpdated);
  }, [socket, taskId, queryClient]);

  // Form change handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
    setHasUnsavedChanges(true);
  };

  const handleStatusChange = (e) => handleFormChange("status", e.target.value);
  const handleCategoryChange = (e) => handleFormChange("category", e.target.value);
  const handlePriorityChange = (e) => handleFormChange("priority", e.target.value);
  const handleIssueChange = (e) => handleFormChange("issueType", e.target.value);

  const handleMultiChange = (event) => {
    const value = typeof event.target.value === "string"
      ? event.target.value.split(",")
      : event.target.value;
    handleFormChange("assignees", value);
  };

  // Save changes
  const handleSave = async () => {
    if (!socket || !task?._id || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      socket.emit("updateTask", {
        taskId: task._id,
        projectId: task.project,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        priority: formData.priority,
        issueType: formData.issueType,
        assignedTo: formData.assignees,
      });

      setHasUnsavedChanges(false);
      setEditingTitle(false);
      setEditingDescription(false);
      
      // Optimistic update
      setTasks((prevColumns) => {
        const columns = { ...prevColumns };
        let currentStatus = null;
        let taskIndex = -1;

        for (const [colStatus, tasks] of Object.entries(columns)) {
          const idx = tasks.findIndex((t) => t?._id?.toString() === taskId?.toString());
          if (idx !== -1) {
            currentStatus = colStatus;
            taskIndex = idx;
            break;
          }
        }

        if (currentStatus === null || taskIndex === -1) return columns;

        const updatedTask = {
          ...columns[currentStatus][taskIndex],
          title: formData.title,
          description: formData.description,
          taskStatus: formData.status,
          category: formData.category,
          priority: formData.priority,
          issueType: formData.issueType,
          assignedTo: formData.assignees,
        };

        // Remove from current column
        columns[currentStatus] = [
          ...columns[currentStatus].slice(0, taskIndex),
          ...columns[currentStatus].slice(taskIndex + 1),
        ];

        // Add to target column
        const targetStatus = formData.status;
        if (!columns[targetStatus]) columns[targetStatus] = [];
        columns[targetStatus] = [...columns[targetStatus], updatedTask];

        return columns;
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete task (admin only)
  const handleDeleteTask = async () => {
    if (!socket || !task?._id) return;
    
    try {
      socket.emit("deleteTask", {
        taskId: task._id,
        projectId: task.project,
      });
      
      setTasks((prevColumns) => {
        const columns = { ...prevColumns };
        for (const [status, tasks] of Object.entries(columns)) {
          columns[status] = tasks.filter((t) => t?._id?.toString() !== taskId?.toString());
        }
        return columns;
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Check if user can delete (admin only)
  const canDelete = currentUserRole === "admin";

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Highest": return "text-red-400 bg-red-500/20";
      case "High": return "text-orange-400 bg-orange-500/20";
      case "Medium": return "text-yellow-400 bg-yellow-500/20";
      case "Low": return "text-blue-400 bg-blue-500/20";
      case "Lowest": return "text-gray-400 bg-gray-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "toDo": return "text-gray-400 bg-gray-500/20";
      case "Inprogress": return "text-blue-400 bg-blue-500/20";
      case "Inreview": return "text-purple-400 bg-purple-500/20";
      case "done": return "text-green-400 bg-green-500/20";
      case "Failed": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-start justify-center z-50 pt-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-950/50 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-slate-500 font-mono text-sm tracking-tight">
              {task.key || task._id.slice(-8).toUpperCase()}
            </span>
            {editingTitle ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                className="text-xl font-semibold text-white bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h2 
                className="text-xl font-semibold text-white truncate cursor-pointer hover:bg-slate-800 px-2 py-1 rounded"
                onClick={() => setEditingTitle(true)}
              >
                {formData.title}
                <Edit3 className="inline w-3 h-3 ml-2 text-slate-400" />
              </h2>
            )}
            {hasUnsavedChanges && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                hasUnsavedChanges && !isSaving
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="text-2xl text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "details" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "activity" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setShowSubtaskModal(true)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            Subtasks
          </button>
          <button
            onClick={() => setShowTaskChat(true)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Task Chat
          </button>
          {canDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center gap-2 transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </button>
          )}
        </div>

        {/* Main Content - Two Panel Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Left Panel - Task Details */}
            <div className="w-1/2 border-r border-slate-700 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-300 font-medium">Description</h3>
                    <button
                      onClick={() => setEditingDescription(!editingDescription)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  {editingDescription ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      onBlur={() => setEditingDescription(false)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-4 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-slate-200 min-h-[120px] whitespace-pre-wrap cursor-pointer hover:bg-slate-800/70"
                      onClick={() => setEditingDescription(true)}
                    >
                      {formData.description || (
                        <span className="text-slate-500 italic">
                          Click to add description...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Task Properties */}
                <div className="space-y-4">
                  <h3 className="text-slate-300 font-medium">Task Properties</h3>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
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

                  {/* Priority */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
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

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
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

                  {/* Issue Type */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Issue Type
                    </label>
                    <select
                      value={formData.issueType}
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

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Assigned To
                    </label>
                    <MultipleSelectCheckmarks
                      changehandler={handleMultiChange}
                      names={enumValues.assignedTo}
                      assignedTo={formData.assignees}
                    />
                  </div>

                  {/* Story Points */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Story Points
                    </label>
                    <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200">
                      {task.storyPoints ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Activity/Details */}
            <div className="w-1/2 overflow-y-auto p-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Task Summary */}
                  <div>
                    <h3 className="text-slate-300 font-medium mb-4">Task Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                          {formData.status === "Inprogress" ? "In Progress" : formData.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Priority</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                          {formData.priority || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Created</span>
                        <span className="text-slate-200 text-sm">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Updated</span>
                        <span className="text-slate-200 text-sm">
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Created by</span>
                        <div className="flex items-center gap-2">
                          <img
                            src={task.createdBy?.profilePic?.url || "/user.png"}
                            alt="creator"
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-slate-200 text-sm">
                            {task.createdBy?.username || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignees */}
                  <div>
                    <h3 className="text-slate-300 font-medium mb-4">Assignees</h3>
                    <div className="space-y-2">
                      {task.assignedTo?.length > 0 ? (
                        task.assignedTo.map((user) => (
                          <div key={user._id} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                            <img
                              src={user.profilePic?.url || "/user.png"}
                              alt={user.username}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <div className="text-white text-sm font-medium">{user.username}</div>
                              <div className="text-slate-400 text-xs">{user.email}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">No assignees</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Task</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for Subtask Modal */}
      {showSubtaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Subtasks</h3>
              <button
                onClick={() => setShowSubtaskModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-400">Subtask functionality coming soon...</p>
          </div>
        </div>
      )}

      {/* Placeholder for Task Chat Modal */}
      {showTaskChat && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Task Chat</h3>
              <button
                onClick={() => setShowTaskChat(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-400">Task chat functionality coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskMoreJira;
