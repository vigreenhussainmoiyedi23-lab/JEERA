import React, { useState } from 'react';
import { X, Edit2, Plus, Calendar, MapPin, Briefcase, ExternalLink } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

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
      
      await axiosInstance.patch("/user/profile/update", { experience: updatedExperience });
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

  const handleRemoveExperience = async (indexToRemove) => {
    const updatedExperience = experience.filter((_, index) => index !== indexToRemove);
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", { experience: updatedExperience });
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
    <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-200/80">Experience</h3>
          <p className="text-xs sm:text-sm text-gray-400">Work experience and professional background</p>
        </div>
        {isOwnProfile && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Experience
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {experience && experience.length > 0 ? (
          experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-blue-400/30 pl-4 group relative">
              {isOwnProfile && (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleEditExperience(i)}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-blue-600"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRemoveExperience(i)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{exp.title}</h4>
                  <p className="text-gray-300">{exp.company}</p>
                  {exp.employmentType && (
                    <span className="inline-block px-2 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full mt-1">
                      {exp.employmentType}
                    </span>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                    {exp.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </div>
                    )}
                    {exp.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-400 text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                  )}
                  {exp.companyWebsite && (
                    <a 
                      href={exp.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Company Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic text-center py-8">
            {isOwnProfile ? "No experience added yet. Click 'Add Experience' to add your work history!" : "No experience information available"}
          </div>
        )}
      </div>

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
    title: experience?.title || '',
    company: experience?.company || '',
    employmentType: experience?.employmentType || '',
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    current: experience?.current || false,
    location: experience?.location || '',
    description: experience?.description || '',
    companyWebsite: experience?.companyWebsite || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h3 className="text-lg font-semibold text-white">
            {experience ? 'Edit Experience' : 'Add Experience'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="e.g., Google"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  required
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
                Currently working here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="https://company.com"
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
                rows={4}
                placeholder="Describe your role, responsibilities, achievements, etc."
              />
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
            {loading ? "Saving..." : (experience ? "Update Experience" : "Add Experience")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
