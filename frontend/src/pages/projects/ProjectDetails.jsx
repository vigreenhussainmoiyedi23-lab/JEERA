import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import socket from "../../socket/socket";
import KanbanBoard from "../../components/project/task/KanbanBoard";
import MemberInfo from "../../components/project/MemberInfo";
import ChatBox from "../chat/ChatBox";

const ProjectDetails = () => {
  const { projectid } = useParams();
  useEffect(() => {
    if (!socket) return;

    // --- Join the project room ---
    socket.emit("joinProject", projectid);

    // --- Fetch tasks ---
    socket.emit("getAllTasks", projectid);
    const handleTasks = (tasks) => setTasks(tasks);
    socket.on("allTasks", handleTasks);

    // --- Leave project on unmount ---
    return () => {
      socket.emit("leaveProject", projectid);
      socket.off("allTasks", handleTasks);
    };
  }, [projectid, socket]); // runs whenever projectid changes
  const [current, setCurrent] = useState("tasks");
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["project-details", projectid],
    queryFn: async () =>
      (await axiosInstance.get(`/project/more/${projectid}`)).data,
    staleTime: 1000 * 60 * 5,
  });
  const [tasks, setTasks] = useState([]);
  // ✅ Handle states
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
  const project = data?.project;
  const user = data?.user;
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
          {tasks == "panel" && (
            <div>
              ["admin", "coAdmin"].includes(data.status) &&
              <h1> Admin and Coadmin Panel </h1>
              <button></button>
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
