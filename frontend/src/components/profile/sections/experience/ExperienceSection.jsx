import React, { useEffect, useState } from "react";
import {
  X,
  Edit2,
  Plus,
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import axiosInstance from "../../../../utils/axiosInstance";

const ExperienceSection = ({ user, isOwnProfile, onSectionUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState(user?.experience || []);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveExperience = async (experienceData) => {
    try {
      setLoading(true);
      let updatedExperience;

      if (editingIndex !== null) {
        // Edit existing experience
        updatedExperience = [...experience];
        updatedExperience[editingIndex] = experienceData;
      } else {
        // Add new experience
        updatedExperience = [...experience, experienceData];
      }

      await axiosInstance.patch("/user/profile/update", {
        experience: updatedExperience,
      });
      setExperience(updatedExperience);
      setShowEditModal(false);
      setEditingIndex(null);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error updating experience:", error);
      alert("Failed to update experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.experience) setExperience(user.experience);
  }, [user]);
  const handleRemoveExperience = async (indexToRemove) => {
    const updatedExperience = experience.filter(
      (_, index) => index !== indexToRemove,
    );
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", {
        experience: updatedExperience,
      });
      setExperience(updatedExperience);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error removing experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExperience = (index) => {
    setEditingIndex(index);
    setShowEditModal(true);
  };

  if (!isOwnProfile && (!experience || experience.length === 0)) {
    return null; // Don't show section for other users if they have no experience
  }

  return (
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-y-scroll h-max">
      {/* Section Header */}
      {!showEditModal && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Experience</h3>
                <p className="text-sm text-gray-300">
                  Work experience and professional background
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Content */}
      {!showEditModal && (
        <div className="p-6">
          {experience && experience.length > 0 ? (
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white">
                            {exp.title}
                          </h4>
                          <p className="text-gray-200 font-medium">
                            {exp.company}
                          </p>
                          {exp.employmentType && (
                            <p className="text-gray-400 text-sm">
                              {exp.employmentType}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            {exp.startDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {exp.startDate} -{" "}
                                {exp.current ? "Present" : exp.endDate}
                              </div>
                            )}
                            {exp.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exp.location}
                              </div>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-gray-300 mt-2">
                              {exp.description}
                            </p>
                          )}
                          {exp.companyWebsite && (
                            <a
                              href={exp.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Visit Website
                            </a>
                          )}
                        </div>
                        {isOwnProfile && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditExperience(i)}
                              className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveExperience(i)}
                              className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {i < experience.length - 1 && (
                    <div className="ml-6 mt-4 border-l-2 border-white/10"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">
                No Experience Added Yet
              </h4>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {isOwnProfile
                  ? "Showcase your professional journey by adding your work experience."
                  : "This user hasn't added any work experience yet."}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Experience
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showEditModal && (
        <ExperienceModal
          experience={editingIndex !== null ? experience[editingIndex] : null}
          onSave={handleSaveExperience}
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

const ExperienceModal = ({ experience, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    employmentType: experience?.employmentType || "",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    current: experience?.current || false,
    location: experience?.location || "",
    description: experience?.description || "",
    companyWebsite: experience?.companyWebsite || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-max inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col shadow-2xl border border-white/10 my-8">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {experience ? "Edit Experience" : "Add Experience"}
              </h3>
              <p className="text-sm text-gray-400">
                {experience
                  ? "Update your work experience"
                  : "Add your professional experience"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({ ...formData, employmentType: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Self-employed">Self-employed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
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
                    className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
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
                  className="w-4 h-4 bg-blue-500 border-blue-400 rounded text-white focus:ring-blue-400 focus:ring-offset-2"
                />
                <label
                  htmlFor="current"
                  className="text-sm font-medium text-gray-200"
                >
                  Currently working here
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) =>
                    setFormData({ ...formData, companyWebsite: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="https://company.com"
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
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                  rows={4}
                  placeholder="Describe your role, responsibilities, achievements, etc."
                />
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
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading
              ? "Saving..."
              : experience
                ? "Update Experience"
                : "Add Experience"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
