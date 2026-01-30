import React, { useEffect, useState } from "react";
import {
  X,
  Edit2,
  Plus,
  ExternalLink,
  Github,
  Globe,
  FolderOpen,
  Calendar,
  Upload,
} from "lucide-react";
import axiosInstance from "../../../../utils/axiosInstance";

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

      await axiosInstance.patch("/user/profile/update", {
        profileProjects: updatedProjects,
      });
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

  useEffect(() => {
    if (user?.profileProjects) setProjects(user.profileProjects);
  }, [user]);
  const handleRemoveProject = async (indexToRemove) => {
    const updatedProjects = projects.filter(
      (_, index) => index !== indexToRemove,
    );
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", {
        profileProjects: updatedProjects,
      });
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
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-y-scroll h-max">
      {/* Section Header */}
      {!showEditModal && (
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Projects</h3>
                <p className="text-sm text-gray-300">
                  Portfolio and personal projects
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Content */}
      {!showEditModal && (
        <div className="p-6">
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <div key={i} className="relative group">
                  <div className="bg-slate-700/50 rounded-xl border border-white/10 overflow-hidden">
                    {project.image && (
                      <div className="h-48 bg-slate-800 relative">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-gray-300 text-sm line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        {isOwnProfile && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditProject(i)}
                              className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveProject(i)}
                              className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies &&
                          project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-400/30"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {project.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {project.startDate} -{" "}
                            {project.current ? "Present" : project.endDate}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">
                No Projects Added Yet
              </h4>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {isOwnProfile
                  ? "Showcase your work by adding your personal and professional projects."
                  : "This user hasn't added any projects yet."}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Project
                </button>
              )}
            </div>
          )}
        </div>
      )}
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
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    url: project?.url || "",
    githubUrl: project?.githubUrl || "",
    technologies: project?.technologies
      ? Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies
      : "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    current: project?.current || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let projectData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      // Handle image upload if present
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const response = await axiosInstance.post(
          "/user/profile/upload/project-image",
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        projectData.image = response.data.url;
      }

      onSave(projectData);
    } catch (error) {
      console.error("Error uploading project image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-max inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col shadow-2xl border border-white/10 my-8">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {project ? "Edit Project" : "Add Project"}
              </h3>
              <p className="text-sm text-gray-400">
                {project
                  ? "Update your project details"
                  : "Add your portfolio project"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  placeholder="e.g., E-commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none transition-all"
                  rows={3}
                  placeholder="Describe your project, its purpose, and what you learned..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Project Image
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="project-image-file"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="project-image-file"
                      className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-lg px-4 py-2 text-gray-300 hover:bg-orange-500/30 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {imageFile ? imageFile.name : "Upload Image"}
                      </span>
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Or enter image URL below:
                  </p>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    placeholder="https://example.com/project-screenshot.png"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    placeholder="https://myproject.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  placeholder="React, Node.js, MongoDB, Tailwind CSS"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    disabled={formData.current}
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-500/10 rounded-xl border border-orange-400/30">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current: e.target.checked,
                      endDate: "",
                    })
                  }
                  className="w-4 h-4 bg-orange-500 border-orange-400 rounded text-white focus:ring-orange-400 focus:ring-offset-2"
                />
                <label
                  htmlFor="current"
                  className="text-sm font-medium text-gray-200"
                >
                  Currently working on this project
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10 shrink-0 rounded-b-2xl bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-xl transition-colors border border-white/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {(loading || uploading) && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading || uploading
              ? "Saving..."
              : project
                ? "Update Project"
                : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
