import React from "react";
import { Link } from "react-router-dom";
import MemberInfo from "./MemberInfo";

const ProjectCard = ({ project, status }) => {
  return (
    <div className="group block max-w-4xl mx-auto relative">
      <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-yellow-400/15 via-indigo-500/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="relative rounded-3xl border border-white/10 bg-linear-to-br from-white/6 via-white/4 to-black/20 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_70px_rgba(0,0,0,0.45)] transition-all duration-300 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white group-hover:text-yellow-300 transition-colors">
          {project.title}
        </h2>
        <div>
          <p className="text-sm text-gray-300/70">
            Created on:{" "}
            <span className="text-gray-200/90">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-300/70">
            Your status:{" "}
            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold text-gray-200">
              {status}
            </span>
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-200/80 text-sm md:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      <MemberInfo project={project}/>
      {/* Footer Section */}
      <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-end">
        <button className="inline-flex items-center gap-2 text-yellow-300 font-semibold hover:text-yellow-200 transition-colors">
          <Link to={`/project/${project._id}`}>View Project →</Link>
        </button>
      </div>
      </div>
    </div>
  );
};

export default ProjectCard;
