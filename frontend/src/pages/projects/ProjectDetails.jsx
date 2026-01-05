import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

const ProjectDetails = () => {
  const { projectid } = useParams();

  // ✅ Fetch project data
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-details", projectid],
    queryFn: async () =>
      (await axiosInstance.get(`/project/more/${projectid}`)).data,
    staleTime: 1000 * 60 * 5,
  });

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
        <div className="h-[10vh]"></div>
        <div className="max-w-5xl mx-auto">
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

          {/* Admin Info */}
          <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 mb-10">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Admin
            </h2>
            <p>{project?.admin?.username}</p>
            <p className="text-sm text-gray-400">{project?.admin?.email}</p>
          </div>

          {/* Members & Co-Admins */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {/* Members */}
            <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
                Members
              </h2>
              {project?.members?.length > 0 ? (
                <ul className="space-y-2 text-gray-300">
                  {project.members.map((m) => (
                    <li
                      key={m._id}
                      className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
                    >
                      {m.username}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No members yet.</p>
              )}
            </div>

            {/* Co-Admins */}
            <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
                Co-Admins
              </h2>
              {project?.coAdmins?.length > 0 ? (
                <ul className="space-y-2 text-gray-300">
                  {project.coAdmins.map((a) => (
                    <li
                      key={a._id}
                      className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
                    >
                      {a.username}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No co-admins.</p>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 mb-10">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
              Tasks
            </h2>
            {user?.tasks?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:scale-[1.02] transition"
                  >
                    <h3 className="text-lg font-bold text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {task.categoury}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        task.taskStatus === "finished"
                          ? "bg-green-600/30 text-green-400"
                          : task.taskStatus === "Inprogress"
                          ? "bg-yellow-600/30 text-yellow-400"
                          : "bg-gray-600/30 text-gray-300"
                      }`}
                    >
                      {task.taskStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tasks created yet.</p>
            )}
          </div>

          {/* Notifications / New Messages */}
          <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-3">
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
