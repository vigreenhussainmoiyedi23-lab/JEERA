import React, { useState } from "react";
import { X, Plus, Briefcase, GraduationCap, Award, BookOpen, Code } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const AddProfileSectionModal = ({ isOpen, onClose, onUpdate, user }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const allSections = [
    {
      id: 'skills',
      title: 'Skills',
      icon: <Code className="w-5 h-5" />,
      description: 'Add your technical and professional skills',
      placeholder: 'Enter skills separated by commas (e.g., JavaScript, React, Node.js)'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Projects',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Showcase your portfolio projects',
      placeholder: 'Add your portfolio projects'
    },
    {
      id: 'education',
      title: 'Education',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Add your educational background',
      placeholder: 'Add your education details'
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Add your work experience',
      placeholder: 'Add your work experience'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: <Award className="w-5 h-5" />,
      description: 'Add your certifications and achievements',
      placeholder: 'Add your certifications'
    }
  ];

  // Filter out sections that already exist
  const sections = allSections.filter(section => {
    switch (section.id) {
      case 'skills':
        return !user?.skills || user.skills.length === 0;
      case 'portfolio':
        return !user?.profileProjects || user.profileProjects.length === 0;
      case 'education':
        return !user?.education || user.education.length === 0;
      case 'experience':
        return !user?.experience || user.experience.length === 0;
      case 'certifications':
        return !user?.certifications || user.certifications.length === 0;
      default:
        return true;
    }
  });

  const handleSectionSubmit = async (sectionId, value) => {
    if (!value.trim()) return;

    try {
      setLoading(true);
      let updateData = {};

      switch (sectionId) {
        case 'skills':
          const skills = value.split(',').map(s => s.trim()).filter(s => s);
          updateData = { skills };
          break;
        case 'portfolio':
          // Open the AddProjectModal instead of redirecting to edit modal
          onUpdate({ 
            activeTab: 'portfolio',
            showAddProjectModal: true 
          });
          onClose();
          return;
        case 'education':
          // For education, you might want a more complex structure
          updateData = { education: [{ description: value }] };
          break;
        case 'experience':
          // For experience, you might want a more complex structure
          updateData = { experience: [{ description: value }] };
          break;
        case 'certifications':
          updateData = { certifications: [{ title: value }] };
          break;
        default:
          return;
      }

      await axiosInstance.patch("/user/profile/update", updateData);
      onUpdate(updateData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile section:", error);
      alert("Failed to update profile section. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-semibold text-white">Add Profile Section</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!activeSection ? (
            <div className="space-y-3">
              {sections.length > 0 ? (
                <>
                  <p className="text-gray-400 text-sm mb-4">
                    Choose a section to add to your profile:
                  </p>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section)}
                      className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all text-left group"
                    >
                      <div className="text-yellow-400 group-hover:scale-110 transition-transform">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Plus className="w-12 h-12 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    All sections added!
                  </h3>
                  <p className="text-sm text-gray-400">
                    You've already added all available sections to your profile.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Back to sections
              </button>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                <div className="text-yellow-400">
                  {sections.find(s => s.id === activeSection.id)?.icon}
                </div>
                <h3 className="font-medium text-white">
                  {activeSection.title}
                </h3>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSectionSubmit(activeSection.id, formData.get('value'));
              }}>
                <div>
                  <textarea
                    name="value"
                    placeholder={activeSection.placeholder}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                    rows={4}
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding..." : `Add ${activeSection.title}`}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProfileSectionModal;
