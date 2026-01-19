import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import ProjectCard from "../../components/project/ProjectCard";
import axiosInstance from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const Projects = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await axiosInstance.get("/user/other/projects")).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading)
    return (
      <p className="bg-linear-to-br flex items-center justify-center text-white min-h-screen w-full from-zinc-800 via-slate-950 to-gray-900">
        Loading projects...
      </p>
    );

  if (isError)
    return (
      <p className="bg-linear-to-br flex items-center justify-center text-white min-h-screen w-full from-zinc-800 via-slate-950 to-gray-900">
        {error.message || "Error loading projects"}
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="bg-linear-to-br overflow-x-hidden text-white min-h-screen w-full relative from-zinc-800 via-slate-950 to-gray-900 px-5">
        {/* Top buttons */}
        <div className="md:flex hidden justify-between flex-wrap w-full items-center py-5">
          <Link
            className="text-lg md:text-xl font-semibold bg-yellow-300 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-200"
            to={"/createProject"}
          >
            Create Project
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-yellow-300">
            All Your Projects
          </h1>
          <Link
            className="text-lg md:text-xl font-semibold bg-blue-400 text-black px-4 py-2 rounded-full hover:bg-blue-500 transition duration-200"
            to={"/tasks"}
          >
            View Task Board
          </Link>
        </div>

        {/* Mobile top buttons */}
        <div className="flex md:hidden flex-col w-full items-center py-5 gap-3">
          <h1 className="text-2xl font-bold text-center text-yellow-300">
            All Your Projects
          </h1>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              className="text-sm md:text-xl font-semibold bg-yellow-300 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-200"
              to={"/createProject"}
            >
              Create Project
            </Link>
            <Link
              className="text-sm md:text-xl font-semibold bg-blue-400 text-black px-4 py-2 rounded-full hover:bg-blue-500 transition duration-200"
              to={"/tasks"}
            >
              View Task Board
            </Link>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-8 w-full flex flex-col items-center gap-5">
          {data.projects.length === 0 && (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-5">
              <p className="text-white font-serif text-center text-sm md:text-base w-60 md:w-80 h-20 rounded-full bg-slate-800/25 flex items-center justify-center">
                No projects created or you are not in any projects
              </p>
              <Link
                className="text-lg md:text-xl font-semibold bg-yellow-300 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-200"
                to={"/createProject"}
              >
                Create Project
              </Link>
            </div>
          )}

          {data.projects.length > 0 &&
            data.projects.map((p, idx) => (
              <ProjectCard key={idx} project={p.project} status={p.status} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
