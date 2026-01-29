import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
  const [editingField, setEditingField] = useState(null);
  const [activityTab, setActivityTab] = useState("comments");
  const [historySort, setHistorySort] = useState("newest");

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  // Subtasks (embedded)
  const [subtasks, setSubtasks] = useState([]);
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskDescription, setNewSubtaskDescription] = useState("");
  const [subtaskError, setSubtaskError] = useState(null);

  // Comments (task chat)
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageError, setMessageError] = useState(null);
  const [visibleMessageCount, setVisibleMessageCount] = useState(6);
  const commentsContainerRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);

  // Sync form state when task data arrives / updates
  useEffect(() => {
    if (!task) return;
    console.log(`status ${task.taskStatus}`);
    setStatus(task.taskStatus ?? "toDo");
    setCategory(task.category ?? "");
    setPriority(task.priority ?? "");
    setIssueType(task.issueType ?? "");
    setAssignees(task.assignedTo?.map((u) => u._id) ?? []);
    setTitleDraft(task.title ?? "");
    setDescriptionDraft(task.description ?? "");
  }, [task]);

  useEffect(() => {
    if (!taskId) return;

    const fetchSubtasks = async () => {
      try {
        setSubtasksLoading(true);
        setSubtaskError(null);
        const { data } = await axiosInstance.get(`/task/${taskId}/subtasks`);
        const next = (data.subtasks || []).slice().sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bt - at;
        });
        setSubtasks(next);
      } catch (error) {
        setSubtaskError("Failed to load subtasks");
        console.error("Failed to fetch subtasks:", error);
      } finally {
        setSubtasksLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        setMessageError(null);
        const { data } = await axiosInstance.get(`/task/${taskId}/chat`);
        const sorted = (data.messages || []).slice().sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return at - bt;
        });
        setMessages(sorted);
        setVisibleMessageCount(6);
      } catch (error) {
        setMessageError("Failed to load comments");
        console.error("Failed to fetch messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchSubtasks();
    fetchMessages();
  }, [taskId]);

  useEffect(() => {
    if (activityTab !== "comments") return;
    const el = commentsContainerRef.current;
    if (!el) return;
    if (!shouldStickToBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, activityTab, visibleMessageCount]);

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

    // Add error handling for socket
    const handleSocketError = (error) => {
      console.error("Socket error:", error);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("error", handleSocketError);
    socket.on("connect_error", handleConnectError);
    
    return () => {
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("error", handleSocketError);
      socket.off("connect_error", handleConnectError);
    };
  }, [socket, taskId, queryClient]);

  const sendUpdate = (changes) => {
    if (!socket || !task?._id) {
      console.warn("Cannot send update: missing socket or task");
      return;
    }
    console.log("Sending socket update:", changes);
    socket.emit("updateTask", {
      taskId: task._id,
      projectId: task.project,
      ...changes,
    });
  };

  const optimisticDetailUpdate = (partial) => {
    // Update detail view cache
    queryClient.setQueryData(["task", taskId], (prev) => {
      if (!prev) return prev;
      return { ...prev, ...partial };
    });
    // Update kanban card cache
    optimisticKanbanUpdate((old) => ({ ...old, ...partial }));
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

  const handleAssigneesChange = (event) => {
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    setAssignees(value);
    optimisticKanbanUpdate((old) => ({
      ...old,
      assignedTo: value,
    }));
    sendUpdate({ assignedTo: value });
  };

  const createSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    try {
      setSubtaskError(null);
      const submitData = {
        title: newSubtaskTitle.trim(),
        description: newSubtaskDescription.trim(),
        status: "toDo",
        assignedTo: null,
      };
      const { data } = await axiosInstance.post(`/task/${taskId}/subtasks`, submitData);
      setSubtasks((prev) => [data.subtask, ...prev]);
      setNewSubtaskTitle("");
      setNewSubtaskDescription("");
      setShowAddSubtask(false);
    } catch (error) {
      setSubtaskError(error?.response?.data?.message || "Failed to create subtask");
      console.error("Failed to create subtask:", error);
    }
  };

  const toggleSubtaskDone = async (subtask) => {
    try {
      const nextStatus = subtask.status === "done" ? "toDo" : "done";
      const { data } = await axiosInstance.patch(
        `/task/${taskId}/subtasks/${subtask._id}`,
        {
          title: subtask.title,
          description: subtask.description,
          status: nextStatus,
          assignedTo: subtask.assignedTo?._id || null,
        },
      );
      setSubtasks((prev) =>
        prev.map((s) => (s._id === subtask._id ? data.subtask : s)),
      );
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      setMessageError(null);
      const payload = { message: newMessage.trim() };
      const { data } = await axiosInstance.post(`/task/${taskId}/chat`, payload);
      setMessages((prev) => {
        const next = [...prev, data.message].sort((a, b) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return at - bt;
        });
        return next;
      });
      setVisibleMessageCount(6);
      shouldStickToBottomRef.current = true;
      setNewMessage("");
    } catch (error) {
      setMessageError(error?.response?.data?.message || "Failed to send comment");
      console.error("Failed to send message:", error);
    }
  };

  const doneCount = subtasks.filter((s) => s.status === "done").length;
  const totalCount = subtasks.length;
  const completionPct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const saveTitle = () => {
    const next = titleDraft.trim();
    if (next.length < 3) {
      setTitleDraft(task.title ?? "");
      setIsEditingTitle(false);
      return;
    }
    if (next === (task.title ?? "")) {
      setIsEditingTitle(false);
      return;
    }
    optimisticDetailUpdate({ title: next });
    sendUpdate({ title: next });
    setIsEditingTitle(false);
  };

  const saveDescription = () => {
    const next = descriptionDraft;
    if (next === (task.description ?? "")) {
      setIsEditingDescription(false);
      return;
    }
    optimisticDetailUpdate({ description: next });
    sendUpdate({ description: next });
    setIsEditingDescription(false);
  };

  const visibleMessages = messages.slice(Math.max(0, messages.length - visibleMessageCount));

  const selectedAssigneeNames = (enumValues?.assignedTo || [])
    .filter((n) => assignees.includes(n.member._id))
    .map((n) => n.member.username);

  const historySorted = (task?.history || []).slice().sort((a, b) => {
    const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return historySort === "oldest" ? at - bt : bt - at;
  });

  const onCommentsScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    shouldStickToBottomRef.current = nearBottom;

    // Load older when user scrolls up to top
    if (el.scrollTop < 40 && visibleMessageCount < messages.length) {
      const prevScrollHeight = el.scrollHeight;
      setVisibleMessageCount((c) => Math.min(c + 6, messages.length));
      // After render, keep viewport stable (approx)
      requestAnimationFrame(() => {
        const nextScrollHeight = el.scrollHeight;
        el.scrollTop = nextScrollHeight - prevScrollHeight;
      });
    }
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                {isEditingTitle ? (
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                      if (e.key === "Escape") {
                        setTitleDraft(task.title ?? "");
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 text-2xl font-semibold text-white outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="w-full text-left text-2xl font-semibold text-white leading-snug hover:bg-slate-800/30 rounded px-1 py-1"
                  >
                    {task.title}
                  </button>
                )}
              </div>

              {/* Assignees */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-2">Assignees</div>
                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                  <MultipleSelectCheckmarks
                    changehandler={handleAssigneesChange}
                    names={enumValues.assignedTo}
                    assignedTo={assignees}
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    {selectedAssigneeNames.length > 0
                      ? selectedAssigneeNames.join(", ")
                      : "Unassigned"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-2">Description</div>
                {isEditingDescription ? (
                  <textarea
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    onBlur={saveDescription}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setDescriptionDraft(task.description ?? "");
                        setIsEditingDescription(false);
                      }
                    }}
                    autoFocus
                    className="w-full bg-slate-900/40 border border-slate-700 rounded-lg p-4 text-slate-100 outline-none min-h-[110px]"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="w-full text-left bg-slate-800/40 border border-slate-700 rounded-lg p-4 text-slate-200 whitespace-pre-wrap min-h-[90px] hover:bg-slate-800/60"
                  >
                    {task.description ? (
                      task.description
                    ) : (
                      <span className="text-slate-500">Add a description…</span>
                    )}
                  </button>
                )}
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-300">Subtasks</div>
                  <button
                    onClick={() => setShowAddSubtask((v) => !v)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Add subtask
                  </button>
                </div>

                {/* Progress */}
                <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                    <span>{doneCount}/{totalCount} done</span>
                    <span>{completionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {showAddSubtask && (
                  <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add subtask"
                      className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none"
                    />
                    <textarea
                      value={newSubtaskDescription}
                      onChange={(e) => setNewSubtaskDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-slate-900/40 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none min-h-[70px]"
                    />
                    {subtaskError && (
                      <div className="text-sm text-red-400">{subtaskError}</div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={createSubtask}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowAddSubtask(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-3 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/40 border border-slate-700 rounded-lg">
                  {subtasksLoading ? (
                    <div className="p-4 text-slate-400 text-sm">Loading subtasks…</div>
                  ) : subtasks.length === 0 ? (
                    <div className="p-4 text-slate-500 text-sm">No subtasks yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-700">
                      {subtasks.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => toggleSubtaskDone(s)}
                          className="w-full text-left p-3 hover:bg-slate-800/60 flex items-center gap-3"
                        >
                          <div
                            className={`h-4 w-4 rounded border ${
                              s.status === "done"
                                ? "bg-blue-500 border-blue-500"
                                : "border-slate-500"
                            }`}
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-sm ${
                                s.status === "done"
                                  ? "text-slate-400 line-through"
                                  : "text-slate-100"
                              }`}
                            >
                              {s.title}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-2">Activity</div>
                <div className="flex gap-2 mb-3">
                  {[
                    { id: "comments", label: "Comments" },
                    { id: "history", label: "History" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActivityTab(t.id)}
                      className={`text-xs px-3 py-1.5 rounded ${
                        activityTab === t.id
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {activityTab === "comments" && (
                  <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                    {messageError && (
                      <div className="mb-2 text-sm text-red-400">{messageError}</div>
                    )}

                    <div
                      ref={commentsContainerRef}
                      onScroll={onCommentsScroll}
                      className="h-72 overflow-y-auto border border-slate-700 rounded-lg bg-slate-900/20 p-3"
                    >
                      {messagesLoading ? (
                        <div className="text-slate-400 text-sm">Loading comments…</div>
                      ) : messages.length === 0 ? (
                        <div className="text-slate-500 text-sm">No comments yet.</div>
                      ) : (
                        <div className="space-y-3">
                          {visibleMessageCount < messages.length && (
                            <div className="text-center">
                              <button
                                onClick={() => setVisibleMessageCount((c) => Math.min(c + 6, messages.length))}
                                className="text-xs text-blue-400 hover:text-blue-300"
                              >
                                Load older
                              </button>
                            </div>
                          )}
                          {visibleMessages.map((m) => (
                            <div key={m._id} className="border border-slate-700 rounded p-3">
                              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                <span>{m.sender?.username || "User"}</span>
                                <span>
                                  {m.createdAt
                                    ? new Date(m.createdAt).toLocaleTimeString()
                                    : ""}
                                </span>
                              </div>
                              <div className="text-sm text-slate-100 whitespace-pre-wrap">
                                {m.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <form onSubmit={sendComment} className="mt-3 flex gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a comment…"
                        className="flex-1 bg-slate-900/40 border border-slate-700 rounded px-3 py-2 text-slate-100 outline-none"
                        onFocus={() => {
                          shouldStickToBottomRef.current = true;
                        }}
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {activityTab === "history" && (
                  <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-slate-400">Sort</div>
                      <select
                        value={historySort}
                        onChange={(e) => setHistorySort(e.target.value)}
                        className="bg-slate-900/40 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 outline-none"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                      </select>
                    </div>

                    {historySorted.length > 0 ? (
                      <div className="max-h-[50vh] overflow-y-auto pr-1">
                        <div className="space-y-3">
                          {historySorted.map((entry) => (
                            <div key={entry._id} className="border border-slate-700 rounded p-3">
                              <div className="flex justify-between text-slate-400 text-xs mb-2">
                                <span>
                                  {entry.createdAt
                                    ? new Date(entry.createdAt).toLocaleString()
                                    : ""}
                                </span>
                                <span className="font-medium">
                                  {entry.user?.username}
                                </span>
                              </div>
                              <div className="text-slate-200 text-sm">
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
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">No history yet.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details sidebar */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-300 mb-2">Details</div>

              {/* Helper row */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg divide-y divide-slate-700">
                {/* Status */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Status</div>
                  <div>
                    {editingField === "status" ? (
                      <select
                        value={status}
                        onChange={(e) => {
                          handleStatusChange(e);
                          setEditingField(null);
                        }}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full bg-slate-900/40 border border-slate-700 rounded px-2 py-1.5 text-sm text-white outline-none"
                      >
                        {enumValues.taskStatus.map((s) => (
                          <option key={s} value={s}>
                            {s === "Inprogress" ? "In Progress" : s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField("status")}
                        className="text-sm text-slate-100 hover:bg-slate-800/60 px-2 py-1 rounded w-full text-left"
                      >
                        {status || "None"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Assignees */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Assignees</div>
                  <div className="text-sm text-slate-100 px-2 py-1">
                    {selectedAssigneeNames.length > 0
                      ? selectedAssigneeNames.join(", ")
                      : "Unassigned"}
                  </div>
                </div>

                {/* Priority */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Priority</div>
                  <div>
                    {editingField === "priority" ? (
                      <select
                        value={priority}
                        onChange={(e) => {
                          handlePriorityChange(e);
                          setEditingField(null);
                        }}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full bg-slate-900/40 border border-slate-700 rounded px-2 py-1.5 text-sm text-white outline-none"
                      >
                        {enumValues.priority.map((p) => (
                          <option key={p} value={p}>
                            {p || "None"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField("priority")}
                        className="text-sm text-slate-100 hover:bg-slate-800/60 px-2 py-1 rounded w-full text-left"
                      >
                        {priority || "None"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Category</div>
                  <div>
                    {editingField === "category" ? (
                      <select
                        value={category}
                        onChange={(e) => {
                          handleCategoryChange(e);
                          setEditingField(null);
                        }}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full bg-slate-900/40 border border-slate-700 rounded px-2 py-1.5 text-sm text-white outline-none"
                      >
                        <option value="">None</option>
                        {enumValues.category.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField("category")}
                        className="text-sm text-slate-100 hover:bg-slate-800/60 px-2 py-1 rounded w-full text-left"
                      >
                        {category || "None"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Issue Type */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Issue Type</div>
                  <div>
                    {editingField === "issueType" ? (
                      <select
                        value={issueType}
                        onChange={(e) => {
                          handleIssueChange(e);
                          setEditingField(null);
                        }}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full bg-slate-900/40 border border-slate-700 rounded px-2 py-1.5 text-sm text-white outline-none"
                      >
                        <option value="">None</option>
                        {enumValues.issueType.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField("issueType")}
                        className="text-sm text-slate-100 hover:bg-slate-800/60 px-2 py-1 rounded w-full text-left"
                      >
                        {issueType || "None"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Story Points (read-only for now) */}
                <div className="p-3 grid grid-cols-2 gap-3">
                  <div className="text-xs text-slate-400">Story Points</div>
                  <div className="text-sm text-slate-100 px-2 py-1">
                    {task.storyPoints ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskMore;
