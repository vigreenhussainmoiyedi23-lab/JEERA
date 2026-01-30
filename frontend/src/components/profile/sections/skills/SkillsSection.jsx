import React, { useState, useRef, useEffect } from "react";
import { X, Edit2, Plus, Upload, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../../../../utils/axiosInstance";

const SkillsSection = ({ user, isOwnProfile, onSectionUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user?.skills) setSkills(user.skills);
  }, [user]);

  const handleSaveSkills = async (newSkills) => {
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", {
        skills: newSkills,
      });
      setSkills(newSkills);
      setShowEditModal(false);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error updating skills:", error);
      alert("Failed to update skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    await handleSaveSkills(updatedSkills);
  };

  if (!isOwnProfile && (!skills || skills.length === 0)) {
    return null; // Don't show section for other users if they have no skills
  }

  return (
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-y-scroll h-max">
      {/* Section Header */}
      {!showEditModal && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Skills & Expertise
                </h3>
                <p className="text-sm text-gray-300">
                  Professional skills and technical expertise
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Skills
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Content */}
      {!showEditModal && (
        <div className="p-6">
          {skills && skills.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className="group relative bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-lg px-4 py-2 transition-all hover:shadow-lg hover:border-blue-400/50"
                  >
                    <span className="text-gray-100 font-medium">{skill}</span>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Skills Image Display */}
              {user?.skillImage && (
                <div className="mt-6">
                  <div className="relative group">
                    <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-200">
                      Skills Showcase
                    </div>
                    <img
                      src={user.skillImage.url}
                      alt="Skills showcase"
                      className="w-full h-48 object-cover rounded-lg shadow-lg border border-white/10"
                    />
                    {isOwnProfile && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-8 h-8 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 text-gray-200 rounded-full text-xs flex items-center justify-center shadow-lg border border-white/20"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleRemoveImage}
                          className="w-8 h-8 bg-red-500/90 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">
                No Skills Added Yet
              </h4>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {isOwnProfile
                  ? "Start building your professional profile by adding your key skills and expertise."
                  : "This user hasn't added any skills yet."}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Skill
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 h-max overflow-scroll">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/10">
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Edit Skills
                  </h3>
                  <p className="text-sm text-gray-400">
                    Update your professional skills and expertise
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 h-max p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Skills
                  </label>
                  <div className="relative">
                    <textarea
                      defaultValue={skills.join(",")}
                      placeholder="JavaScript, React, Node.js, Python, etc."
                      className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                      rows={4}
                      id="skills-textarea"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your skills separated by commas. Example: JavaScript,
                    React, Node.js
                  </p>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10 shrink-0 bg-slate-800/50">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-xl transition-colors border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const textarea = document.getElementById("skills-textarea");
                  const newSkills = textarea.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s);
                  handleSaveSkills(newSkills);
                }}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
