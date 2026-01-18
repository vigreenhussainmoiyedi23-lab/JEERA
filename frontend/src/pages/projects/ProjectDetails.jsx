import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import socket from "../../socket/socket";
import KanbanBoard from "../../components/project/task/KanbanBoard";
import MemberInfo from "../../components/project/MemberInfo";

const ProjectDetails = () => {
  const { projectid } = useParams();
  useEffect(() => {
    // ✅ Listen for tasks (before connecting or emitting)
    const handleTasks = (tasks) => {
      setTasks(tasks);
    };
    socket.emit("getAllTasks", projectid);
    socket.on("allTasks", handleTasks);

    // ✅ On connect
    socket.on("connect", () => {
      socket.emit("joinProject", projectid);
      socket.emit("get-all-tasks", projectid);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off("all-tasks", handleTasks);
      socket.off("connect");
    };
  }, [projectid]);
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
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-zinc-800 via-slate-950 to-gray-900">
        <p className="text-lg animate-pulse">Loading project details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400 bg-gradient-to-br from-zinc-800 via-slate-950 to-gray-900">
        <p className="text-lg font-semibold">⚠️ Error loading project.</p>
        <p className="text-sm text-gray-400 mt-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
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

      <div className="min-h-screen bg-gradient-to-br from-zinc-800 via-slate-950 to-gray-900 text-white py-16 px-5 sm:px-10">
        {/* Header */}

        <MemberInfo project={project} />

        <div className="h-[10vh]"></div>
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-gray-700 pb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300">
              {project?.title}
            </h1>
            <p className="text-sm text-gray-400">
              Created on:{" "}
              <span className="text-gray-300">
                {new Date(project?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg mb-10 leading-relaxed">
            {project?.description || "No description provided."}
          </p>
          <div className="w-full flex relative items-center justify-center lg:gap-10 gap-4 flex-nowrap mb-4">
            <button
              onClick={() => setCurrent("tasks")}
              className="border-b-blue-700 text-yellow-300 text-sm md:text-lg xl:text-xl font-bold bg-slate-600 px-3 py-2 rounded-3xl"
              style={{ background: current == "tasks" ? "#111" : "" }}
            >
              Tasks
            </button>
            <button
              onClick={() => setCurrent("chats")}
              className="border-b-blue-700 text-yellow-300 text-sm md:text-lg xl:text-xl font-bold bg-slate-600 px-3 py-2 rounded-3xl"
              style={{ background: current == "chats" ? "#111" : "" }}
            >
              Chat
            </button>
            <button
              onClick={() => setCurrent("panel")}
              className="border-b-blue-700 text-yellow-300 text-sm md:text-lg xl:text-xl font-bold bg-slate-600 px-3 py-2 rounded-3xl"
              style={{ background: current == "panel" ? "#111" : "" }}
            >
              Your Panel
            </button>
          </div>
          {/* Tasks */}
          {current == "tasks" && (
            <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 mb-10 w-full min-h-screen">
              <h2 className="text-2xl font-extrabold text-yellow-400 mb-3 text-center">
                Tasks
              </h2>
              <KanbanBoard projectId={projectid} currentUser={user} />
            </div>
          )}
          {/* Notifications / New Messages */}
          {current == "chats" && (
            <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 mb-5">
              <h2 className="text-2xl  font-semibold text-yellow-400 mb-3">
                Recent Updates
              </h2>
              {project?.newMessages?.length > 0 ? (
                <ul className="space-y-3">
                  {project.newMessages.map((msg, i) => (
                    <li
                      key={i}
                      className="border border-gray-700 bg-gray-800 rounded-lg px-4 py-2"
                    >
                      <p className="font-medium text-white">{msg.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(msg.CreatedAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No new updates.</p>
              )}
            </div>
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
