import React from "react";
import { Menu, X } from "lucide-react";

const ProjectSubNavbar = ({ project, status, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="lg:hidden bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-16 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-white truncate">{project?.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubNavbar;
