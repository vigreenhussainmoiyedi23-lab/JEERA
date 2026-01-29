import React, { useState, useEffect } from "react";
import { X, Upload, MapPin, Briefcase, Link as LinkIcon, User } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const EditProfileModal = ({ user, isOpen, onClose, onUpdate, activeTab }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    location: {
      city: user?.location?.city || "",
      country: user?.location?.country || ""
    },
    profileProjects: user?.profileProjects || [],
    contactInfo: {
      phone: user?.contactInfo?.phone || "",
      website: user?.contactInfo?.website || ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [portfolioItem, setPortfolioItem] = useState({
    title: "",
    description: "",
    link: "",
    technologies: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.patch("/user/profile/update", formData);
      onUpdate(data.user);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioItem = () => {
    if (portfolioItem.title && portfolioItem.link) {
      setFormData(prev => ({
        ...prev,
        profileProjects: [...prev.profileProjects, {
          ...portfolioItem,
          technologies: portfolioItem.technologies.split(',').map(t => t.trim()).filter(t => t)
        }]
      }));
      setPortfolioItem({ title: "", description: "", link: "", technologies: "" });
    }
  };

  const removePortfolioItem = (index) => {
    setFormData(prev => ({
      ...prev,
      profileProjects: prev.profileProjects.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (isOpen && activeTab === 'portfolio') {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        const portfolioSection = document.getElementById('portfolio-section');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <User className="w-5 h-5 text-yellow-400" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="Your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="e.g. Software Developer at Tech Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              Location
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value }
                  }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-yellow-400" />
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.contactInfo.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, website: e.target.value }
                  }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div id="portfolio-section" className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-yellow-400" />
              Portfolio Projects
            </h3>
            
            {/* Add new portfolio item */}
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={portfolioItem.title}
                  onChange={(e) => setPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Project title"
                />
                <input
                  type="url"
                  value={portfolioItem.link}
                  onChange={(e) => setPortfolioItem(prev => ({ ...prev, link: e.target.value }))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  placeholder="Project link"
                />
              </div>
              <textarea
                value={portfolioItem.description}
                onChange={(e) => setPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                rows={2}
                placeholder="Project description"
              />
              <input
                type="text"
                value={portfolioItem.technologies}
                onChange={(e) => setPortfolioItem(prev => ({ ...prev, technologies: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                placeholder="Technologies (comma-separated)"
              />
              <button
                type="button"
                onClick={addPortfolioItem}
                disabled={!portfolioItem.title || !portfolioItem.link}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Project
              </button>
            </div>

            {/* Existing portfolio items */}
            {formData.profileProjects.length > 0 && (
              <div className="space-y-3">
                {formData.profileProjects.map((item, index) => (
                  <div key={index} className="bg-black/20 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 text-sm mt-2 inline-block"
                        >
                          View Project
                        </a>
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removePortfolioItem(index)}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 pb-6 border-t border-white/10 sticky bottom-0 bg-slate-900">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
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

export default EditProfileModal;
