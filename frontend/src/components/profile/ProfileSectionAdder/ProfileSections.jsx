import React, { useState } from "react";
import { Plus, Briefcase, GraduationCap, Award, BookOpen, Code, Edit, Trash2, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import AddProjectModal from "./AddProjectModal";
import SocialButtons from "./SocialButtons";

function ProfileSections({ user, isOwnProfile }) {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  if (!isOwnProfile) return null;

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

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Profile Sections</h3>
        
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

      {/* Section Forms Modal */}
      {activeSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                {activeSection.action === 'add' ? 'Add' : 'Edit'} {allSections.find(s => s.id === activeSection.id)?.title}
              </h3>
              <button
                onClick={() => setActiveSection(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Skills Form */}
              {activeSection.id === 'skills' && (
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
                      type="button"
                      onClick={() => setActiveSection(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : "Save Skills"}
                    </button>
                  </div>
                </form>
              )}

              {/* Education Form */}
              {activeSection.id === 'education' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleEducationSubmit({
                    school: formData.get('school'),
                    degree: formData.get('degree'),
                    field: formData.get('field'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    current: formData.get('current') === 'on'
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">School</label>
                      <input name="school" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="University name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
                      <input name="degree" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="Bachelor's, Master's, etc." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Field of Study</label>
                      <input name="field" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="Computer Science, etc." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                        <input name="startDate" type="month" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                        <input name="endDate" type="month" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400/50" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input name="current" type="checkbox" className="rounded border-white/10 bg-black/20 text-yellow-400 focus:ring-yellow-400/50" />
                        Currently studying here
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setActiveSection(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? "Saving..." : "Save Education"}
                    </button>
                  </div>
                </form>
              )}

              {/* Experience Form */}
              {activeSection.id === 'experience' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleExperienceSubmit({
                    title: formData.get('title'),
                    company: formData.get('company'),
                    location: formData.get('location'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    current: formData.get('current') === 'on',
                    description: formData.get('description')
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                      <input name="title" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                      <input name="company" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="Company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input name="location" type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="City, Country" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                        <input name="startDate" type="month" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                        <input name="endDate" type="month" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400/50" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input name="current" type="checkbox" className="rounded border-white/10 bg-black/20 text-yellow-400 focus:ring-yellow-400/50" />
                        Currently working here
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea name="description" rows={3} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" placeholder="Describe your role and responsibilities"></textarea>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setActiveSection(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? "Saving..." : "Save Experience"}
                    </button>
                  </div>
                </form>
              )}

              {/* Certifications Form */}
              {activeSection.id === 'certifications' && (
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Certification Name</label>
                      <input name="name" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="AWS Certified Solutions Architect" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Issuing Organization</label>
                      <input name="organization" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="Amazon Web Services" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Issue Date</label>
                      <input name="issueDate" type="month" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Credential URL (optional)</label>
                      <input name="credentialUrl" type="url" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50" placeholder="https://credential.net/verify" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setActiveSection(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? "Saving..." : "Save Certification"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          user={user}
        />
      )}
    </>
  );
}

export default ProfileSections;
