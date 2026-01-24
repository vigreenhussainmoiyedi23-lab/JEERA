import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import socket from "../../socket/socket";
import KanbanBoard from "../../components/project/task/KanbanBoard";
import MemberInfo from "../../components/project/MemberInfo";
import ChatBox from "../chat/ChatBox";
import { RefreshCcw, Shield, UserPlus, Users } from "lucide-react";

const ProjectDetails = () => {
  const { projectid } = useParams();
  useEffect(() => {
    if (!socket) return;

    const handleTasks = (tasks) => setTasks(tasks);

    const joinAndFetch = () => {
      socket.emit("joinProject", projectid);
      socket.emit("getAllTasks", projectid);
    };

    // Ensure we join the room even if the socket connects after initial render
    if (socket.connected) {
      joinAndFetch();
    } else {
      socket.once("connect", joinAndFetch);
    }

    socket.on("allTasks", handleTasks);
    socket.on("reconnect", joinAndFetch);

    // --- Leave project on unmount ---
    return () => {
      socket.off("connect", joinAndFetch);
      socket.off("reconnect", joinAndFetch);
      socket.emit("leaveProject", projectid);
      socket.off("allTasks", handleTasks);
    };
  }, [projectid, socket]); // runs whenever projectid changes
  const [current, setCurrent] = useState("tasks");
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["project-details", projectid],
    queryFn: async () =>
      (await axiosInstance.get(`/project/more/${projectid}`)).data,
    staleTime: 1000 * 60 * 5,
  });
  const [tasks, setTasks] = useState([]);
  const project = data?.project;
  const user = data?.user;
  const status = data?.status;

  const myProjectTasks = useMemo(() => {
    const t = user?.tasks || [];
    return Array.isArray(t) ? t.map((x) => x.task).filter(Boolean) : [];
  }, [user]);

  const myCounts = useMemo(() => {
    const base = {
      total: 0,
      toDo: 0,
      Inprogress: 0,
      Inreview: 0,
      done: 0,
      Failed: 0,
    };
    if (!Array.isArray(myProjectTasks)) return base;
    base.total = myProjectTasks.length;
    myProjectTasks.forEach((t) => {
      const s = t?.taskStatus;
      if (s && Object.prototype.hasOwnProperty.call(base, s)) base[s] += 1;
    });
    return base;
  }, [myProjectTasks]);

  const [usersPage, setUsersPage] = useState(1);
  const {
    data: adminAnalytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    error: analyticsErr,
    refetch: refetchAnalytics,
    isFetching: analyticsFetching,
  } = useQuery({
    queryKey: ["admin-analytics", projectid],
    queryFn: async () =>
      (await axiosInstance.get(`/project/admin/analytics/${projectid}`)).data,
    enabled: current === "panel" && ["admin", "coAdmin"].includes(status),
    staleTime: 1000 * 30,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
    refetch: refetchUsers,
    isFetching: usersFetching,
  } = useQuery({
    queryKey: ["users", usersPage],
    queryFn: async () =>
      (
        await axiosInstance.get(
          `/user/other/users?page=${usersPage}&limit=12`,
        )
      ).data,
    enabled: current === "panel" && ["admin", "coAdmin"].includes(status),
    staleTime: 1000 * 30,
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (userid) =>
      (
        await axiosInstance.post(
          `/project/admin/invite/${projectid}/${userid}`,
        )
      ).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["project-details", projectid],
      });
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async ({ userid, to }) =>
      (
        await axiosInstance.patch(
          `/project/admin/promote/${projectid}/${userid}/${to}`,
        )
      ).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["project-details", projectid],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (userid) =>
      (
        await axiosInstance.delete(`/project/admin/remove/${projectid}/${userid}`)
      ).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["project-details", projectid],
      });
    },
  });

  const panelRefresh = async () => {
    await refetch();
    if (["admin", "coAdmin"].includes(status)) {
      await refetchAnalytics();
      await refetchUsers();
    }
  };

  const statusCards = [
    {
      key: "total",
      label: "Total",
      value: myCounts.total,
      accent: "from-white/10 to-transparent",
    },
    {
      key: "toDo",
      label: "To Do",
      value: myCounts.toDo,
      accent: "from-yellow-400/15 to-transparent",
    },
    {
      key: "Inprogress",
      label: "In Progress",
      value: myCounts.Inprogress,
      accent: "from-sky-400/15 to-transparent",
    },
    {
      key: "Inreview",
      label: "In Review",
      value: myCounts.Inreview,
      accent: "from-purple-400/15 to-transparent",
    },
    {
      key: "done",
      label: "Done",
      value: myCounts.done,
      accent: "from-emerald-400/15 to-transparent",
    },
    {
      key: "Failed",
      label: "Failed",
      value: myCounts.Failed,
      accent: "from-red-400/15 to-transparent",
    },
  ];

  // ✅ Handle states (after hooks to keep hook order stable)
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-linear-to-br from-zinc-800 via-slate-950 to-gray-900">
        <p className="text-lg animate-pulse">Loading project details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400 bg-linear-to-br from-zinc-800 via-slate-950 to-gray-900">
        <p className="text-lg font-semibold">⚠️ Error loading project.</p>
        <p className="text-sm text-gray-400 mt-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition shadow-[0_10px_30px_rgba(250,204,21,0.16)]"
        >
          Try Again
        </button>
      </div>
    );
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-zinc-800 via-slate-950 to-gray-900 text-white py-16 px-5 sm:px-10">
        {/* Header */}

        <MemberInfo project={project} />

        <div className="h-[10vh]"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {project?.title}
              </h1>
              <p className="mt-2 text-sm text-gray-200/60">
                Created on{" "}
                <span className="text-gray-200/90">
                  {new Date(project?.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs sm:text-sm text-gray-200/80">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="font-medium">Project workspace</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-6 sm:p-8">
            <p className="text-gray-200/80 text-sm sm:text-base leading-relaxed">
              {project?.description || "No description provided."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrent("tasks")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  current === "tasks"
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-black/20 border-white/10 text-gray-200/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setCurrent("chats")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  current === "chats"
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-black/20 border-white/10 text-gray-200/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setCurrent("panel")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  current === "panel"
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-black/20 border-white/10 text-gray-200/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Your Panel
              </button>
            </div>
          </div>
          {/* Tasks */}
          {current == "tasks" && (
            <div className="mt-6 mb-10 w-full">
              <KanbanBoard projectId={projectid} currentUser={user} />
            </div>
          )}
          {/* Notifications / New Messages */}
          {current == "chats" && (
           <ChatBox projectId={projectid} currentUser={user}/>
          )}
          {/* Users Panel */}
          {current === "panel" && (
            <div className="mt-6 mb-10 h-max min-h-screen">
              <div
               className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs sm:text-sm text-gray-200/80">
                      <Shield className="h-4 w-4" />
                      <span className="font-semibold">{status || "member"}</span>
                      <span className="text-gray-200/60">panel</span>
                    </div>
                    <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Your analytics
                    </h2>
                    <p className="mt-1 text-sm text-gray-200/70">
                      Snapshot for your tasks in this project.
                    </p>
                  </div>

                  <button
                    onClick={panelRefresh}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/5 px-4 py-2 text-sm text-gray-200/80 transition"
                  >
                    <RefreshCcw
                      className={
                        "h-4 w-4 " +
                        (inviteMemberMutation.isPending ||
                        promoteMutation.isPending ||
                        removeMutation.isPending ||
                        usersFetching
                          ? "animate-spin"
                          : "")
                      }
                    />
                    Refresh
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {statusCards.map((c) => (
                    <div
                      key={c.key}
                      className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden"
                    >
                      <div className={`h-1.5 bg-linear-to-r ${c.accent}`} />
                      <div className="p-4">
                        <div className="text-xs font-semibold text-gray-200/70">
                          {c.label}
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                          {c.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Your tasks
                        </div>
                        <div className="mt-1 text-xs text-gray-200/70">
                          This is scoped to tasks assigned to you.
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-200/80 bg-black/25 border border-white/10 px-2.5 py-1 rounded-full">
                        {myCounts.total}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {myProjectTasks.slice(0, 6).map((t) => (
                        <div
                          key={t._id}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <div className="text-sm font-semibold text-white truncate">
                            {t.title || "Untitled"}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-200/70 flex items-center justify-between gap-2">
                            <span className="truncate">{t.issueType || "task"}</span>
                            <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-2 py-0.5">
                              {t.taskStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                      {myProjectTasks.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-gray-200/70">
                          No tasks assigned to you yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="text-sm font-semibold text-white">
                      Project members
                    </div>
                    <div className="mt-1 text-xs text-gray-200/70">
                      View team roles. Admin/coAdmin can manage members.
                    </div>

                    <div className="mt-4 space-y-2 max-h-105 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
                      {(project?.members || []).map((m) => {
                        const memberId = m?.member?._id;
                        const role = m?.role;
                        const canManage =
                          ["admin", "coAdmin"].includes(status) &&
                          role !== "admin";

                        return (
                          <div
                            key={memberId}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={
                                    m?.member?.profilePic?.url || "/user.png"
                                  }
                                  alt="member"
                                  className="h-9 w-9 rounded-full object-cover border border-white/10 bg-black/20"
                                />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-white truncate">
                                    {m?.member?.username || "User"}
                                  </div>
                                  <div className="text-xs text-gray-200/70 truncate">
                                    {m?.member?.email || ""}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold text-gray-200/80 bg-black/25 border border-white/10 px-2.5 py-1 rounded-full">
                                  {role}
                                </span>

                                {status === "admin" && canManage && (
                                  <>
                                    {role === "member" ? (
                                      <button
                                        onClick={() =>
                                          promoteMutation.mutate({
                                            userid: memberId,
                                            to: "coAdmin",
                                          })
                                        }
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition"
                                      >
                                        Promote
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          promoteMutation.mutate({
                                            userid: memberId,
                                            to: "member",
                                          })
                                        }
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition"
                                      >
                                        Demote
                                      </button>
                                    )}

                                    <button
                                      onClick={() => removeMutation.mutate(memberId)}
                                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-red-500/10 hover:bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-200 transition"
                                    >
                                      Remove
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {["admin", "coAdmin"].includes(status) && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Project analytics
                        </div>
                        <div className="mt-1 text-xs text-gray-200/70">
                          Project-wide summary (admin/coAdmin only).
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-gray-200/75">
                        <RefreshCcw
                          className={
                            "h-4 w-4 " +
                            (analyticsFetching ? "animate-spin" : "")
                          }
                        />
                        <span>Live</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      {analyticsLoading && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-200/70">
                          Loading analytics...
                        </div>
                      )}

                      {analyticsError && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="text-sm font-semibold text-red-300">
                            Failed to load analytics
                          </div>
                          <div className="mt-1 text-xs text-gray-200/70">
                            {analyticsErr?.message || "Something went wrong"}
                          </div>
                        </div>
                      )}

                      {!analyticsLoading && !analyticsError && (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {Object.entries(adminAnalytics?.statusCounts || {}).map(
                              ([k, v]) => (
                                <div
                                  key={k}
                                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                >
                                  <div className="text-xs font-semibold text-gray-200/70">
                                    {k}
                                  </div>
                                  <div className="mt-2 text-2xl font-bold text-white">
                                    {v}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                              <div className="text-sm font-semibold text-white">
                                Per-member breakdown
                              </div>
                              <div className="text-xs text-gray-200/70">
                                Assigned task counts
                              </div>
                            </div>

                            <div className="p-4 space-y-2 max-h-105 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
                              {(adminAnalytics?.perMember || []).length === 0 && (
                                <div className="text-sm text-gray-200/70 text-center py-6">
                                  No member analytics yet.
                                </div>
                              )}
                              {(adminAnalytics?.perMember || []).slice(0, 12).map((m) => (
                                <div
                                  key={m.userId}
                                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img
                                        src={m?.user?.profilePic?.url || "/user.png"}
                                        alt="user"
                                        className="h-9 w-9 rounded-full object-cover border border-white/10 bg-black/20"
                                      />
                                      <div className="min-w-0">
                                        <div className="text-sm font-semibold text-white truncate">
                                          {m?.user?.username || "User"}
                                        </div>
                                        <div className="text-xs text-gray-200/70 truncate">
                                          {m?.user?.email || ""}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="shrink-0 flex flex-wrap gap-2 justify-end">
                                      {Object.entries(m?.counts || {}).map(([k, v]) => (
                                        <span
                                          key={k}
                                          className="text-xs font-semibold text-gray-200/80 bg-black/25 border border-white/10 px-2.5 py-1 rounded-full"
                                        >
                                          {k}: {v}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {["admin", "coAdmin"].includes(status) && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Invite users
                        </div>
                        <div className="mt-1 text-xs text-gray-200/70">
                          Select a user ID from the directory and send an invite.
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-gray-200/75">
                        <UserPlus className="h-4 w-4" />
                        <span>Directory</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      {usersLoading && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-200/70">
                          Loading users...
                        </div>
                      )}
                      {usersError && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="text-sm font-semibold text-red-300">
                            Failed to load users
                          </div>
                          <div className="mt-1 text-xs text-gray-200/70">
                            {usersErr?.message || "Something went wrong"}
                          </div>
                        </div>
                      )}

                      {!usersLoading && !usersError && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(usersData?.users || []).map((u) => (
                            <div
                              key={u._id}
                              className="rounded-2xl border border-white/10 bg-white/5 p-3"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={u?.profilePic?.url || "/user.png"}
                                  alt="user"
                                  className="h-9 w-9 rounded-full object-cover border border-white/10 bg-black/20"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-white truncate">
                                    {u.username || "User"}
                                  </div>
                                  <div className="text-xs text-gray-200/70 truncate">
                                    {u.email || ""}
                                  </div>
                                </div>
                              </div>

                              {(() => {
                                const isInvited = project?.invited?.some(id => id.toString() === u._id);
                                const isMember = project?.members?.some(m => m.member?.toString() === u._id);
                                if (isMember) {
                                  return (
                                    <button
                                      disabled
                                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-600 px-4 py-2 text-xs font-semibold text-white cursor-not-allowed opacity-60"
                                    >
                                      <Users className="h-4 w-4" />
                                      In project
                                    </button>
                                  );
                                }
                                if (isInvited) {
                                  return (
                                    <button
                                      disabled
                                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white cursor-not-allowed opacity-60"
                                    >
                                      <Users className="h-4 w-4" />
                                      Invited
                                    </button>
                                  );
                                }
                                return (
                                  <button
                                    onClick={() => inviteMemberMutation.mutate(u._id)}
                                    disabled={inviteMemberMutation.isPending}
                                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-400 px-4 py-2 text-xs font-semibold text-black shadow-[0_12px_35px_rgba(250,204,21,0.22)] hover:brightness-105 transition disabled:opacity-70"
                                  >
                                    <Users className="h-4 w-4" />
                                    Invite
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Footer */}
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-block text-yellow-400 hover:underline text-sm sm:text-base"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
