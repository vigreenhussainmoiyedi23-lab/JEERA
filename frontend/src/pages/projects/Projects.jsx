import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import ProjectCard from "../../components/project/ProjectCard";
import axiosInstance from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
const Projects = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects"], // unique key for caching
    queryFn: async () => (await axiosInstance.get("/user/other/projects")).data,
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <p>Loading projects...</p>;
  if (isError) return <p>{error}</p>;
  return (
    <>
      <Navbar />
      <div className="bg-linear-to-br text-white min-h-screen w-screen from-zinc-800 via-slate-950 to-gray-900 pt-[10vh] px-5">
        {/* Top buttons */}
        <div className="flex justify-between items-center py-5">
          <Link
            className="text-lg md:text-xl font-semibold bg-yellow-300 text-black px-4 py-2 rounded-t-2xl rounded-b-3xl hover:bg-yellow-400 transition duration-200"
            to={"/createProject"}
          >
            Create Project
          </Link>
          <Link
            className="text-lg md:text-xl font-semibold bg-blue-400 text-black px-4 py-2 rounded-t-2xl rounded-b-3xl hover:bg-blue-500 transition duration-200"
            to={"/tasks"}
          >
            View Tasks
          </Link>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-yellow-300">
            All Your Projects
          </h1>
          {data.projects.length === 0 && (
            <p className="text-sky-300 text-center text-sm">No projects created or you are not in any projects</p>
          )}
          {/* Project Card */}
          {data.projects.length > 0 &&
            data.projects.map((p) => {
              return <ProjectCard project={p.project} status={p.status}/>;
            })}
        </div>
      </div>
    </>
  );
};

export default Projects;
