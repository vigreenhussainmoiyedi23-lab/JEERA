import React, { useState, useRef } from 'react';
import { X, Edit2, Plus, Calendar, MapPin, BookOpen, Upload, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

const EducationSection = ({ user, isOwnProfile, onSectionUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState(user?.education || []);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveEducation = async (educationData) => {
    try {
      setLoading(true);
      let updatedEducation;
      
      if (editingIndex !== null) {
        // Edit existing education
        updatedEducation = [...education];
        updatedEducation[editingIndex] = educationData;
      } else {
        // Add new education
        updatedEducation = [...education, educationData];
      }
      
      await axiosInstance.patch("/user/profile/update", { education: updatedEducation });
      setEducation(updatedEducation);
      setShowEditModal(false);
      setEditingIndex(null);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error updating education:", error);
      alert("Failed to update education. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEducation = async (indexToRemove) => {
    const updatedEducation = education.filter((_, index) => index !== indexToRemove);
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", { education: updatedEducation });
      setEducation(updatedEducation);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error removing education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEducation = (index) => {
    setEditingIndex(index);
    setShowEditModal(true);
  };

  if (!isOwnProfile && (!education || education.length === 0)) {
    return null; // Don't show section for other users if they have no education
  }

  return (
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Education</h3>
              <p className="text-sm text-gray-300">Academic background and qualifications</p>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <div className="p-6">
        {education && education.length > 0 ? (
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={i} className="relative group">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                        <p className="text-gray-200 font-medium">{edu.school}</p>
                        {edu.field && (
                          <p className="text-gray-400 text-sm">{edu.field}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {edu.startDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                            </div>
                          )}
                          {edu.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {edu.location}
                            </div>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                      {isOwnProfile && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleEditEducation(i)}
                            className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveEducation(i)}
                            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < education.length - 1 && (
                  <div className="ml-6 mt-4 border-l-2 border-white/10"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Education Added Yet</h4>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {isOwnProfile 
                ? "Showcase your academic achievements by adding your education history."
                : "This user hasn't added any education information yet."
              }
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Your Education
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showEditModal && (
        <EducationModal
          education={editingIndex !== null ? education[editingIndex] : null}
          onSave={handleSaveEducation}
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

const EducationModal = ({ education, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    degree: education?.degree || '',
    school: education?.school || '',
    field: education?.field || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || '',
    current: education?.current || false,
    location: education?.location || '',
    description: education?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/10">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {education ? 'Edit Education' : 'Add Education'}
              </h3>
              <p className="text-sm text-gray-400">
                {education ? 'Update your academic information' : 'Add your educational background'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  School *
                </label>
                <input
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  placeholder="e.g., University of California"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData({...formData, field: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                placeholder="e.g., Computer Science"
              />
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
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  disabled={formData.current}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-400/30">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: ''})}
                className="w-4 h-4 bg-green-500 border-green-400 rounded text-white focus:ring-green-400 focus:ring-offset-2"
              />
              <label htmlFor="current" className="text-sm font-medium text-gray-200">
                Currently studying here
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none transition-all"
                rows={3}
                placeholder="Brief description of your studies, achievements, etc."
              />
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10 shrink-0 bg-slate-800/50">
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
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Saving..." : (education ? "Update Education" : "Add Education")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
