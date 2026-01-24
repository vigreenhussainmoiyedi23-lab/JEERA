import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Settings, ChevronLeft } from "lucide-react";

const ProjectSidebar = ({
  project,
  status,
  current,
  setCurrent,
  setSidebarOpen,
  myCounts,
  sidebarOpen,
}) => {
  return (
    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 top-[10dvh] h-[90dvh] lg:sticky fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 transition-transform duration-300 ease-in-out mt-16 lg:mt-0 lg:h-screen`}>
      <div className="p-6 h-full overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
        {/* Project Header */}
        <div className="mb-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Projects</span>
          </Link>
          <h2 className="text-xl font-bold text-white mb-2">{project?.title}</h2>
          <p className="text-sm text-gray-400 line-clamp-2">{project?.description || 'No description provided'}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{status}</span>
            <span className="text-xs text-gray-500">{project?.members?.length || 0} members</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <button
            onClick={() => { setCurrent('tasks'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              current === 'tasks' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Tasks Board</span>
          </button>
          <button
            onClick={() => { setCurrent('chats'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              current === 'chats' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Team Chat</span>
          </button>
          <button
            onClick={() => { setCurrent('panel'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              current === 'panel' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Project Panel</span>
          </button>
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Your Tasks</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Assigned</span>
              <span className="text-white font-medium">{myCounts.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">In Progress</span>
              <span className="text-blue-400 font-medium">{myCounts.Inprogress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Completed</span>
              <span className="text-green-400 font-medium">{myCounts.done}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProjectSidebar;
