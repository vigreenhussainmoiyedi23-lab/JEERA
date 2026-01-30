import React, { useState } from 'react';
import { X, Edit2, Plus, ExternalLink, Github, Globe } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

const ProjectsSection = ({ user, isOwnProfile, onSectionUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(user?.profileProjects || []);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveProject = async (projectData) => {
    try {
      setLoading(true);
      let updatedProjects;
      
      if (editingIndex !== null) {
        // Edit existing project
        updatedProjects = [...projects];
        updatedProjects[editingIndex] = projectData;
      } else {
        // Add new project
        updatedProjects = [...projects, projectData];
      }
      
      await axiosInstance.patch("/user/profile/update", { profileProjects: updatedProjects });
      setProjects(updatedProjects);
      setShowEditModal(false);
      setEditingIndex(null);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error updating projects:", error);
      alert("Failed to update projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProject = async (indexToRemove) => {
    const updatedProjects = projects.filter((_, index) => index !== indexToRemove);
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", { profileProjects: updatedProjects });
      setProjects(updatedProjects);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error removing project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (index) => {
    setEditingIndex(index);
    setShowEditModal(true);
  };

  if (!isOwnProfile && (!projects || projects.length === 0)) {
    return null; // Don't show section for other users if they have no projects
  }

  return (
    <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-200/80">Projects</h3>
          <p className="text-xs sm:text-sm text-gray-400">Portfolio projects and work samples</p>
        </div>
        {isOwnProfile && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Project
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project, i) => (
            <div key={i} className="bg-black/20 border border-white/10 rounded-lg p-4 group relative">
              {isOwnProfile && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleEditProject(i)}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-blue-600"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRemoveProject(i)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="space-y-3">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                  />
                )}
                
                <div>
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  {project.description && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full"
                      >
                        {typeof tech === 'string' ? tech.trim() : tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 text-sm inline-flex items-center gap-1"
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500 text-sm italic text-center py-8">
            {isOwnProfile ? "No projects added yet. Click 'Add Project' to showcase your portfolio!" : "No projects available"}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showEditModal && (
        <ProjectModal
          project={editingIndex !== null ? projects[editingIndex] : null}
          onSave={handleSaveProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingIndex(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

const ProjectModal = ({ project, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    url: project?.url || '',
    githubUrl: project?.githubUrl || '',
    technologies: project?.technologies ? (Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies) : '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    current: project?.current || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    };
    onSave(projectData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h3 className="text-lg font-semibold text-white">
            {project ? 'Edit Project' : 'Add Project'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                rows={3}
                placeholder="Describe your project, its purpose, and what you learned..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="https://example.com/project-screenshot.png"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="https://myproject.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="React, Node.js, MongoDB, Tailwind CSS"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  disabled={formData.current}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: ''})}
                className="w-4 h-4 bg-black/20 border border-white/10 rounded text-yellow-400 focus:ring-yellow-400/50"
              />
              <label htmlFor="current" className="text-sm text-gray-300">
                Currently working on this project
              </label>
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : (project ? "Update Project" : "Add Project")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
