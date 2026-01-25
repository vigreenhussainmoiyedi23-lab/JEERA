import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import socket from "../../socket/socket";
import KanbanBoard from "../../components/project/task/KanbanBoard";
import MemberInfo from "../../components/project/MemberInfo";
import ChatBox from "../chat/ChatBox";
import ProjectPanel from "../../components/project/ProjectPanel";
import ProjectSidebar from "../../components/project/ProjectSidebar";
import ProjectSubNavbar from "../../components/project/ProjectSubNavbar";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    mutationFn: async (userid) => {
      const { data } = await axiosInstance.delete(
        `/project/admin/remove/${projectid}/${userid}`
      );
      return data;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-analytics", projectid] });
    },
  });

  const banMutation = useMutation({
    mutationFn: async (userid) => {
      const { data } = await axiosInstance.post(
        `/project/admin/ban/${projectid}/${userid}`
      );
      return data;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-analytics", projectid] });
    },
  });

  const unbanMutation = useMutation({
    mutationFn: async (userid) => {
      const { data } = await axiosInstance.post(
        `/project/admin/unban/${projectid}/${userid}`
      );
      return data;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-analytics", projectid] });
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
      <div className="min-h-screen flex items-center justify-center text-white bg-linear-to-br from-slate-900 via-gray-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg animate-pulse">Loading project details...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400 bg-linear-to-br from-slate-900 via-gray-900 to-slate-950">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-xl font-semibold mb-2">Error loading project</p>
          <p className="text-sm text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  return (
    <>
      <Navbar />
      
      {/* Mobile Sub-navbar */}
      <ProjectSubNavbar 
        project={project} 
        status={status} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-slate-950 ">
        {/* Sidebar */}
        <ProjectSidebar 
          project={project}
          status={status}
          current={current}
          setCurrent={setCurrent}
          setSidebarOpen={setSidebarOpen}
          myCounts={myCounts}
          sidebarOpen={sidebarOpen}
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 pb-20">
            {/* Tasks */}
            {current == "tasks" && (
              <div className="w-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">Tasks Board</h1>
                  <p className="text-gray-400">Manage and track project tasks</p>
                </div>
                <KanbanBoard projectId={projectid} currentUser={user} userRole={status} userId={user?._id} />
              </div>
            )}
            {/* Notifications / New Messages */}
            {current == "chats" && (
              <div className="w-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">Team Chat</h1>
                  <p className="text-gray-400">Communicate with your team</p>
                </div>
                <ChatBox projectId={projectid} currentUser={user}/>
              </div>
            )}
            {/* Users Panel */}
            {current === "panel" && (
              <div className="w-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">Project Panel</h1>
                  <p className="text-gray-400">Analytics and project management</p>
                </div>
                
                <ProjectPanel
                  status={status}
                  myCounts={myCounts}
                  statusCards={statusCards}
                  project={project}
                  panelRefresh={panelRefresh}
                  inviteMemberMutation={inviteMemberMutation}
                  promoteMutation={promoteMutation}
                  removeMutation={removeMutation}
                  banMutation={banMutation}
                  unbanMutation={unbanMutation}
                  adminAnalytics={adminAnalytics}
                  analyticsLoading={analyticsLoading}
                  analyticsError={analyticsError}
                  analyticsErr={analyticsErr}
                  analyticsFetching={analyticsFetching}
                  usersData={usersData}
                  usersLoading={usersLoading}
                  usersError={usersError}
                  usersErr={usersErr}
                  usersFetching={usersFetching}
                  refetchUsers={refetchUsers}
                  myProjectTasks={myProjectTasks}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectDetails;
