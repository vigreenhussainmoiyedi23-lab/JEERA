import React, { useState } from "react";
import { X, Upload, Link } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const AddProjectModal = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    technologies: "",
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      
      let projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(t => t) : []
      };

      // Handle image upload if present
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);
        
        const response = await axiosInstance.post('/user/profile/upload/project-image', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        projectData.image = response.data.url;
      }

      // Add project to profile
      const currentProjects = Array.isArray(onUpdate.user?.profileProjects) ? onUpdate.user.profileProjects : [];
      const updatedProjects = [...currentProjects, projectData];
      
      await axiosInstance.patch("/user/profile/update", {
        profileProjects: updatedProjects
      });

      onUpdate({ profileProjects: updatedProjects });
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        url: "",
        technologies: "",
        image: null
      });
    } catch (error) {
      console.error("Failed to add project:", error);
      alert("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-semibold text-white">Add Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
              placeholder="Describe your project"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              placeholder="React, Node.js, MongoDB (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Image
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="project-image"
              />
              <label
                htmlFor="project-image"
                className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-gray-300 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">
                  {formData.image ? formData.image.name : "Choose image"}
                </span>
              </label>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-slate-900">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Project"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
