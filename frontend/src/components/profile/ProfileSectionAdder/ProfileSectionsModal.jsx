import React, { useState } from "react";
import { X, Plus, Briefcase, GraduationCap, Award, BookOpen, Code, Edit, Trash2 } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import AddProjectModal from "../AddProjectModal";

const ProfileSectionsModal = ({ isOpen, onClose, user }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const allSections = [
    {
      id: 'skills',
      title: 'Skills',
      icon: <Code className="w-5 h-5" />,
      description: 'Technical and professional skills',
      hasData: user?.skills?.length > 0,
      dataCount: user?.skills?.length || 0,
      dataPreview: user?.skills?.slice(0, 3).join(', ') || 'No skills added'
    },
    {
      id: 'education',
      title: 'Education',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Educational background and qualifications',
      hasData: user?.education?.length > 0,
      dataCount: user?.education?.length || 0,
      dataPreview: user?.education?.slice(0, 2).map(e => e.school).join(', ') || 'No education added'
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Work experience and employment history',
      hasData: user?.experience?.length > 0,
      dataCount: user?.experience?.length || 0,
      dataPreview: user?.experience?.slice(0, 2).map(e => e.company || e.title).join(', ') || 'No experience added'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Projects',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Showcase your portfolio projects',
      hasData: user?.profileProjects?.length > 0,
      dataCount: user?.profileProjects?.length || 0,
      dataPreview: user?.profileProjects?.slice(0, 2).map(p => p.title).join(', ') || 'No projects added'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: <Award className="w-5 h-5" />,
      description: 'Professional certifications and achievements',
      hasData: user?.certifications?.length > 0,
      dataCount: user?.certifications?.length || 0,
      dataPreview: user?.certifications?.slice(0, 2).map(c => c.title).join(', ') || 'No certifications added'
    }
  ];

  const handleSectionAction = (sectionId, action) => {
    if (action === 'add') {
      if (sectionId === 'portfolio') {
        setShowAddProjectModal(true);
      } else {
        setActiveSection({ id: sectionId, action: 'add' });
      }
    } else if (action === 'edit') {
      setActiveSection({ id: sectionId, action: 'edit' });
    }
  };

  const handleSkillsSubmit = async (skills) => {
    try {
      setLoading(true);
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
      await axiosInstance.patch("/user/profile/update", { skills: skillsArray });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update skills:", error);
      alert("Failed to update skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEducationSubmit = async (educationData) => {
    try {
      setLoading(true);
      const currentEducation = Array.isArray(user?.education) ? user.education : [];
      const updatedEducation = [...currentEducation, educationData];
      await axiosInstance.patch("/user/profile/update", { education: updatedEducation });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update education:", error);
      alert("Failed to update education. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (experienceData) => {
    try {
      setLoading(true);
      const currentExperience = Array.isArray(user?.experience) ? user.experience : [];
      const updatedExperience = [...currentExperience, experienceData];
      await axiosInstance.patch("/user/profile/update", { experience: updatedExperience });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update experience:", error);
      alert("Failed to update experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCertificationsSubmit = async (certificationData) => {
    try {
      setLoading(true);
      const currentCertifications = Array.isArray(user?.certifications) ? user.certifications : [];
      const updatedCertifications = [...currentCertifications, certificationData];
      await axiosInstance.patch("/user/profile/update", { certifications: updatedCertifications });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update certifications:", error);
      alert("Failed to update certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-4 sm:my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Profile Sections</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {!activeSection ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm mb-6">
                  Manage your profile sections. Add, edit, or remove information from each section.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allSections.map((section) => (
                    <div key={section.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-yellow-400">
                            {section.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-white flex items-center gap-2">
                              {section.title}
                              {section.hasData && (
                                <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">
                                  {section.dataCount}
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 truncate">
                          {section.dataPreview}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSectionAction(section.id, 'add')}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          {section.hasData ? 'Add More' : 'Add'}
                        </button>
                        {section.hasData && (
                          <button
                            onClick={() => handleSectionAction(section.id, 'edit')}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                
                {/* Skills Form */}
                {activeSection.id === 'skills' && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Code className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-medium text-white">
                        {activeSection.action === 'add' ? 'Add Skills' : 'Edit Skills'}
                      </h3>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleSkillsSubmit(formData.get('skills'));
                    }}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Skills (comma separated)
                        </label>
                        <textarea
                          name="skills"
                          placeholder="JavaScript, React, Node.js, Python, etc."
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                          rows={3}
                          defaultValue={activeSection.action === 'edit' ? user?.skills?.join(', ') : ''}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Save Skills"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection(null)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Education Form */}
                {activeSection.id === 'education' && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <GraduationCap className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-medium text-white">Add Education</h3>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleEducationSubmit({
                        school: formData.get('school'),
                        degree: formData.get('degree'),
                        fieldOfStudy: formData.get('fieldOfStudy'),
                        startYear: formData.get('startYear'),
                        endYear: formData.get('endYear')
                      });
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            School/Institution *
                          </label>
                          <input
                            type="text"
                            name="school"
                            placeholder="Harvard University"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Degree
                          </label>
                          <input
                            type="text"
                            name="degree"
                            placeholder="Bachelor of Science"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          name="fieldOfStudy"
                          placeholder="Computer Science"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Year
                          </label>
                          <input
                            type="number"
                            name="startYear"
                            placeholder="2018"
                            min="1950"
                            max={new Date().getFullYear()}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            End Year
                          </label>
                          <input
                            type="number"
                            name="endYear"
                            placeholder="2022"
                            min="1950"
                            max={new Date().getFullYear() + 10}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Add Education"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection(null)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Experience Form */}
                {activeSection.id === 'experience' && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Briefcase className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-medium text-white">Add Experience</h3>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleExperienceSubmit({
                        role: formData.get('role'),
                        company: formData.get('company'),
                        location: formData.get('location'),
                        description: formData.get('description'),
                        startDate: formData.get('startDate'),
                        endDate: formData.get('endDate'),
                        isCurrent: formData.get('isCurrent') === 'on'
                      });
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Job Role *
                          </label>
                          <input
                            type="text"
                            name="role"
                            placeholder="Senior Software Engineer"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Company *
                          </label>
                          <input
                            type="text"
                            name="company"
                            placeholder="Google"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          placeholder="San Francisco, CA"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Date
                          </label>
                          <input
                            type="month"
                            name="startDate"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            End Date
                          </label>
                          <input
                            type="month"
                            name="endDate"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          placeholder="Describe your role and responsibilities..."
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Add Experience"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection(null)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Certifications Form */}
                {activeSection.id === 'certifications' && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-medium text-white">Add Certification</h3>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleCertificationsSubmit({
                        name: formData.get('name'),
                        organization: formData.get('organization'),
                        issueDate: formData.get('issueDate'),
                        credentialUrl: formData.get('credentialUrl')
                      });
                    }}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Certification Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="AWS Certified Solutions Architect"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Issuing Organization *
                        </label>
                        <input
                          type="text"
                          name="organization"
                          placeholder="Amazon Web Services"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Issue Date
                          </label>
                          <input
                            type="month"
                            name="issueDate"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Credential URL
                          </label>
                          <input
                            type="url"
                            name="credentialUrl"
                            placeholder="https://aws.amazon.com/verification"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Add Certification"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection(null)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Project Modal */}
      <AddProjectModal
        user={user}
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onUpdate={window.location.reload}
      />
    </>
  );
};

export default ProfileSectionsModal;
