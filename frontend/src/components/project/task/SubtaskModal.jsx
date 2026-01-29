import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { X, Plus, Edit3, Trash2, Check, Clock, User } from "lucide-react";

function SubtaskModal({ taskId, onClose, enumValues, currentUser }) {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "toDo",
    assignedTo: ""
  });

  useEffect(() => {
    fetchSubtasks();
  }, [taskId]);

  const fetchSubtasks = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/task/${taskId}/subtasks`);
      console.log("Fetched subtasks:", data);
      setSubtasks(data.subtasks || []);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!", { formData, taskId });
    
    try {
      // Clean up the form data - convert empty string to null for assignedTo
      const submitData = {
        ...formData,
        assignedTo: formData.assignedTo || null
      };

      console.log("Submit data:", submitData);

      if (editingSubtask) {
        // Update subtask
        await axiosInstance.patch(`/task/${taskId}/subtasks/${editingSubtask._id}`, submitData);
      } else {
        // Create new subtask
        console.log("Making POST request to:", `/task/${taskId}/subtasks`);
        const response = await axiosInstance.post(`/task/${taskId}/subtasks`, submitData);
        console.log("Create response:", response);
      }
      
      // Reset form and refetch
      setFormData({ title: "", description: "", status: "toDo", assignedTo: "" });
      setShowCreateForm(false);
      setEditingSubtask(null);
      fetchSubtasks();
    } catch (error) {
      console.error("Failed to save subtask:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      // Don't show alert for now, just log to console
    }
  };

  const handleEdit = (subtask) => {
    setEditingSubtask(subtask);
    setFormData({
      title: subtask.title,
      description: subtask.description || "",
      status: subtask.status,
      assignedTo: subtask.assignedTo?._id || ""
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (subtaskId) => {
    if (!confirm("Are you sure you want to delete this subtask?")) return;
    
    try {
      await axiosInstance.delete(`/task/${taskId}/subtasks/${subtaskId}`);
      fetchSubtasks();
    } catch (error) {
      console.error("Failed to delete subtask:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "toDo": return "text-gray-400 bg-gray-500/20";
      case "inProgress": return "text-blue-400 bg-blue-500/20";
      case "done": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "toDo": return "To Do";
      case "inProgress": return "In Progress";
      case "done": return "Done";
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Subtasks</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Create/Edit Form */}
            {showCreateForm && (
              <div className="p-6 border-b border-slate-700 bg-slate-800/50">
                <h3 className="text-lg font-medium text-white mb-4">
                  {editingSubtask ? "Edit Subtask" : "Create New Subtask"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="toDo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">
                        Assigned To
                      </label>
                      <select
                        value={formData.assignedTo}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Unassigned</option>
                        {enumValues?.assignedTo?.map((user) => (
                          <option key={user.member._id} value={user.member._id}>
                            {user.member.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingSubtask(null);
                        setFormData({ title: "", description: "", status: "toDo", assignedTo: "" });
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editingSubtask ? "Update" : "Create"} Subtask
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Subtasks List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : subtasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">No subtasks yet</div>
                 
                  <button
                    onClick={() =>{ 
                      setShowCreateForm(true)}}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create First Subtask
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask._id}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-medium truncate">{subtask.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}>
                              {getStatusLabel(subtask.status)}
                            </span>
                          </div>
                          
                          {subtask.description && (
                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                              {subtask.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Created by {subtask.createdBy?.username}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(subtask.createdAt).toLocaleDateString()}</span>
                            </div>
                            {subtask.assignedTo && (
                              <div className="flex items-center gap-2">
                                <img
                                  src={subtask.assignedTo.profilePic?.url || "/user.png"}
                                  alt={subtask.assignedTo.username}
                                  className="h-4 w-4 rounded-full"
                                />
                                <span>{subtask.assignedTo.username}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEdit(subtask)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subtask._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!showCreateForm && (
              <div className="p-4 border-t border-slate-700">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Subtask
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubtaskModal;
