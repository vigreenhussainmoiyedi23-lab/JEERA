import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, status }) => {
  return (
    <div className="group block max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-yellow-300/20 hover:scale-[1.02] transition-transform duration-300 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-yellow-300 transition">
          {project.title}
        </h2>
        <div>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            Created on:{" "}
            <span className="text-gray-300">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            Your status: <span className="text-gray-300">{status}</span>
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
        {project.description}
      </p>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
        {/* Admin Info */}
        <div>
          <h3 className="font-semibold text-yellow-400 mb-1">Admin</h3>
          <p>{project.admin?.username || "Username"}</p>
          <p className="text-xs text-gray-400">
            {project.admin?.email || "admin@email.com"}
          </p>
        </div>

        {/* Members Info */}
        <div>
          <h3 className="font-semibold text-yellow-400 mb-1">Members</h3>
          <div className="flex flex-wrap gap-2">
            {project.members.length > 0 &&
              project.members.splice(1, 2).map((m, idx) => (
                <span
                  key={m._id}
                  className="bg-gray-700 px-2 py-1 rounded-md text-sm"
                >
                  {m.username}
                </span>
              ))}
          </div>
        </div>

        {/* Co-Admins */}
        <div>
          <h3 className="font-semibold text-yellow-400 mb-1">Co-Admins</h3>
          {project.coAdmins.length > 0 &&
            project.coAdmins
              .splice(1, 2)
              .map((a) => <p key={a._id}>{a.username}</p>)}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-right">
        <button className="text-yellow-400 font-medium hover:underline">
          <Link to={`/project/${project._id}`}>View Project →</Link>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
