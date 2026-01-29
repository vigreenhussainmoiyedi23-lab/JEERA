
import { Edit2, MapPin, Link as LinkIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import EditProfileModal from "./EditProfileModal";
import AddProfileSectionModal from "./AddProfileSectionModal";
import AddProjectModal from "./AddProjectModal";
import ProfileSectionsModal from "./ProfileSectionsModal";
import ConnectionRequests from "./ConnectionRequests";

const Information = ({ user, isOwnProfile, relationship, onRelationshipChange }) => {
  const [isUpdatingRelation, setIsUpdatingRelation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProfileSectionsModal, setShowProfileSectionsModal] = useState(false);
  const [updatingOpenToWork, setUpdatingOpenToWork] = useState(false);
  const [editModalActiveTab, setEditModalActiveTab] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

  if (!user)
    return (
      <div className="text-gray-400 text-center py-10 animate-pulse">
        Loading profile...
      </div>
    );

  const handleProfileUpdate = (updatedUser) => {
    // This will trigger a re-render in the parent component
    window.location.reload();
  };

  const handleOpenToWork = async () => {
    try {
      setUpdatingOpenToWork(true);
      const newStatus = !user.openToWork;
      await axiosInstance.patch("/user/profile/update", {
        openToWork: newStatus
      });
      user.openToWork = newStatus;
      // Force re-render
      window.location.reload();
    } catch (error) {
      console.error("Failed to update open to work status:", error);
    } finally {
      setUpdatingOpenToWork(false);
    }
  };

  const handleAddProfileSection = () => {
    setShowProfileSectionsModal(true);
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    
    try {
      setUploadingBanner(true);
      const formData = new FormData();
      formData.append('banner', file);
      
      const response = await axiosInstance.post('/user/profile/upload/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reload to show updated banner
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload banner:', error);
      alert('Failed to upload banner. Please try again.');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleProfilePicUpload = async (file) => {
    if (!file) return;
    
    try {
      setUploadingProfilePic(true);
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const response = await axiosInstance.post('/user/profile/upload/profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reload to show updated profile picture
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!confirm('Are you sure you want to remove your banner?')) return;
    
    try {
      await axiosInstance.delete('/user/profile/delete/banner');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Failed to remove banner. Please try again.');
    }
  };

  const handleDeleteProfilePic = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    
    try {
      await axiosInstance.delete('/user/profile/delete/profile-pic');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
  };

  const locationText = [user.location?.city, user.location?.country]
    .filter(Boolean)
    .join(", ");

  const followersCount =
    relationship?.followersCount ?? (Array.isArray(user.followers) ? user.followers.length : 0);

  const handleToggleFollow = async () => {
    if (isOwnProfile || !user?._id) return;
    try {
      setIsUpdatingRelation(true);
      const { data } = await axiosInstance.post(`/user/profile/follow/${user._id}`);
      onRelationshipChange?.((prev) => ({
        ...(prev || {}),
        isFollowing: data.isFollowing,
        followersCount: data.followersCount,
      }));
    } catch (e) {
      console.error("Follow toggle failed", e);
    } finally {
      setIsUpdatingRelation(false);
    }
  };

  const handleToggleConnect = async () => {
    if (isOwnProfile || !user?._id) return;
    try {
      setIsUpdatingRelation(true);
      const { data } = await axiosInstance.post(`/user/profile/connect/${user._id}`);
      onRelationshipChange?.((prev) => ({
        ...(prev || {}),
        isConnected: data.isConnected ?? prev?.isConnected,
        requestSent: data.requestSent ?? prev?.requestSent,
        requestReceived: data.requestReceived ?? prev?.requestReceived,
      }));
    } catch (e) {
      console.error("Connect toggle failed", e);
    } finally {
      setIsUpdatingRelation(false);
    }
  };

  return (
    <div className="relative border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden w-full">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={(el) => { if (el) window.bannerInputRef = el; }}
        onChange={(e) => handleBannerUpload(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={(el) => { if (el) window.profilePicInputRef = el; }}
        onChange={(e) => handleProfilePicUpload(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Cover Image (Banner) */}
      <div 
        className="h-32 sm:h-44 bg-linear-to-r from-slate-900 via-slate-900 to-black relative"
        style={{
          backgroundImage: user.profileBanner?.url ? `url(${user.profileBanner.url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.14),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[18px_18px] opacity-25" />
        
        {isOwnProfile && (
          <>
            <div className="absolute top-4 right-4">
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <Edit2 size={18} />
              </button>
            </div>
            
            {/* Upload/Delete overlay */}
            <div 
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => window.bannerInputRef?.click()}
            >
              <div className="text-center">
                {user.profileBanner?.url ? (
                  <div className="space-y-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.bannerInputRef?.click();
                      }}
                      disabled={uploadingBanner}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {uploadingBanner ? 'Uploading...' : 'Change Banner'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBanner();
                      }}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      Remove Banner
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-white mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 011.664.89l.812 1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">Click to add banner</p>
                    <p className="text-white/70 text-sm">Recommended: 1584x396px</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Profile Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8 relative">
        {/* Overlapping Profile Picture */}
        <div className="relative -mt-16 sm:-mt-20 lg:-mt-24 mb-4 sm:mb-6">
          <img
            src={user.profilePic?.url || "/user.png"}
            alt="profile"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full border-4 border-slate-950/60 object-cover bg-slate-800 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
          />
          
          {isOwnProfile && (
            <div 
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => window.profilePicInputRef?.click()}
            >
              <div className="text-center">
                {user.profilePic?.url ? (
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.profilePicInputRef?.click();
                      }}
                      disabled={uploadingProfilePic}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfilePic();
                      }}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-white">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info & Action Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
          <div className="flex-1 space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2 lg:gap-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white">
                {user.username}
              </h2>
              {user.pronouns ? (
                <span className="text-sm sm:text-base text-gray-400 font-normal"> ({user.pronouns})</span>
              ) : null}
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-200/80 leading-relaxed">
              {user.headline || "Add your headline"}
            </p>

            {user.bio && (
              <p className="text-sm sm:text-base text-gray-200/70 leading-relaxed max-w-3xl">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base text-gray-200/60 pt-2">
              {locationText ? (
                <span className="flex items-center gap-1"><MapPin size={16}/> {locationText}</span>
              ) : null}
              {user.openToWork ? (
                <span className="text-emerald-300/90 text-xs sm:text-sm font-semibold bg-emerald-500/10 border border-emerald-400/20 px-2 py-1 rounded-full">
                  Open to work
                </span>
              ) : null}
            </div>

            <p className="text-blue-300 text-sm sm:text-base font-semibold mt-2">
              {followersCount} followers
              {Array.isArray(user.connections) ? ` · ${user.connections.length} connections` : ""}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:shrink-0">
            {isOwnProfile ? (
              <>
                <button 
                  onClick={handleOpenToWork}
                  disabled={updatingOpenToWork}
                  className={`w-full sm:w-auto font-semibold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-colors disabled:opacity-60 ${
                    user.openToWork 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {updatingOpenToWork 
                    ? "Updating..." 
                    : user.openToWork 
                      ? "Open to work ✓" 
                      : "Open to"
                  }
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full sm:w-auto font-semibold px-4 py-2 sm:px-6 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  Edit profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleToggleFollow}
                  disabled={isUpdatingRelation}
                  className={`w-full sm:w-auto font-semibold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-colors disabled:opacity-60 ${
                    relationship?.isFollowing 
                      ? "bg-gray-600 hover:bg-gray-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isUpdatingRelation ? "..." : relationship?.isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={handleToggleConnect}
                  disabled={isUpdatingRelation}
                  className={`w-full sm:w-auto font-semibold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-colors disabled:opacity-60 ${
                    relationship?.isConnected 
                      ? "bg-gray-600 hover:bg-gray-700 text-white" 
                      : relationship?.requestSent 
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isUpdatingRelation 
                    ? "..." 
                    : relationship?.isConnected 
                      ? "Connected" 
                      : relationship?.requestSent 
                        ? "Request sent"
                        : "Connect"
                  }
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. Skills/Tags Section (Simulating LinkedIn "Top Skills") */}
        <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-200/80">Top Skills</h3>
              <a 
                href="/profile/skills" 
                className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Manage skills →
              </a>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                {user.skills?.length > 0 && (
                  <button
                    onClick={() => setShowProfileSectionsModal(true)}
                    className="text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    + Add more
                  </button>
                )}
                {!user.skills?.length && (
                  <button
                    onClick={() => setShowProfileSectionsModal(true)}
                    className="text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    + Add skills
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {user.skills?.length ? (
              user.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-white/5 text-gray-200/80 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-white/10 hover:border-white/20 transition-colors cursor-default group relative"
                >
                  {s}
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        // Remove skill
                        const updatedSkills = user.skills.filter((_, index) => index !== i);
                        axiosInstance.patch("/user/profile/update", { skills: updatedSkills })
                          .then(() => window.location.reload())
                          .catch(console.error);
                      }}
                      className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm sm:text-base italic">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowProfileSectionsModal(true)}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    + Add your skills
                  </button>
                ) : (
                  "No skills listed"
                )}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        {(user.contactInfo?.email || user.contactInfo?.phone || user.contactInfo?.website) && (
          <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-200/80 flex items-center gap-2">
                  <LinkIcon size={16} /> Contact info
                </h3>
                <a 
                  href="/profile/contact" 
                  className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Manage contact →
                </a>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="text-sm sm:text-base text-gray-200/70 space-y-2">
              {user.contactInfo?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Email:</span>
                  <span>{user.contactInfo.email}</span>
                </div>
              )}
              {user.contactInfo?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Phone:</span>
                  <span>{user.contactInfo.phone}</span>
                </div>
              )}
              {user.contactInfo?.website && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Website:</span>
                  <a 
                    href={user.contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {user.contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {Array.isArray(user.education) && user.education.length > 0 ? (
          <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-200/80">Education ({user.education.length})</h3>
                <a 
                  href="/profile/education" 
                  className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Manage education →
                </a>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowProfileSectionsModal(true)}
                  className="text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  + Add education
                </button>
              )}
            </div>
            <div className="space-y-3 sm:space-y-4">
              {user.education.map((e, idx) => (
                <div key={idx} className="text-sm sm:text-base text-gray-200/70 group relative">
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        // Remove education
                        const updatedEducation = user.education.filter((_, index) => index !== idx);
                        axiosInstance.patch("/user/profile/update", { education: updatedEducation })
                          .then(() => window.location.reload())
                          .catch(console.error);
                      }}
                      className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                  <div className="font-semibold text-gray-100 pr-6 sm:pr-8">
                    {e.school}
                  </div>
                  <div className="text-gray-300">
                    {[e.degree, e.fieldOfStudy].filter(Boolean).join(" · ")}
                    {e.startYear || e.endYear ? (
                      <span className="text-gray-400/60"> · {e.startYear || ""}{e.startYear && e.endYear ? " - " : ""}{e.endYear || ""}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isOwnProfile ? (
          <div className="mt-6 p-4 sm:p-5 bg-black/20 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-200/80">Education</h3>
                <a 
                  href="/profile/education" 
                  className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Add education →
                </a>
              </div>
              <button
                onClick={() => setShowProfileSectionsModal(true)}
                className="text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                + Add
              </button>
            </div>
            <p className="text-gray-500 text-sm sm:text-base italic mt-2">
              <button
                onClick={() => setShowProfileSectionsModal(true)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Add your education
              </button>
            </p>
          </div>
        ) : null}

        {/* Experience */}
        {Array.isArray(user.experience) && user.experience.length > 0 && (
          <div className="mt-4 p-4 bg-black/20 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-200/80">Experience ({user.experience.length})</h3>
                <a 
                  href="/profile/experience" 
                  className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Manage experience →
                </a>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowProfileSectionsModal(true)}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  + Add experience
                </button>
              )}
            </div>
            <div className="space-y-3">
              {user.experience.map((exp, idx) => (
                <div key={idx} className="text-sm text-gray-200/70 group relative">
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        // Remove experience
                        const updatedExperience = user.experience.filter((_, index) => index !== idx);
                        axiosInstance.patch("/user/profile/update", { experience: updatedExperience })
                          .then(() => window.location.reload())
                          .catch(console.error);
                      }}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{exp.role}</h4>
                      <p className="text-gray-300">{exp.company}</p>
                      {exp.description && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{exp.description}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(exp.startDate).toLocaleDateString()} - 
                        {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {Array.isArray(user.certifications) && user.certifications.length > 0 && (
          <div className="mt-4 p-4 bg-black/20 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-200/80">Certifications ({user.certifications.length})</h3>
                <a 
                  href="/profile/certifications" 
                  className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Manage certifications →
                </a>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowProfileSectionsModal(true)}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  + Add certification
                </button>
              )}
            </div>
            <div className="space-y-2">
              {user.certifications.map((cert, idx) => (
                <div key={idx} className="text-sm text-gray-200/70 group relative">
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        // Remove certification
                        const updatedCertifications = user.certifications.filter((_, index) => index !== idx);
                        axiosInstance.patch("/user/profile/update", { certifications: updatedCertifications })
                          .then(() => window.location.reload())
                          .catch(console.error);
                      }}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{cert.name}</h4>
                      <p className="text-gray-300">{cert.organization}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Issued {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                        >
                          View credential →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {Array.isArray(user.profileProjects) && user.profileProjects.length > 0 ? (
          <div className="mt-4 p-4 bg-black/20 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-200/80">Projects ({user.profileProjects.length})</h3>
                <a 
                  href="/profile/projects" 
                  className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Manage projects →
                </a>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowProfileSectionsModal(true)}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  + Add project
                </button>
              )}
            </div>
            <div className="space-y-3">
              {user.profileProjects.map((p, idx) => (
                <div key={idx} className="border border-white/10 bg-white/5 p-3 group relative">
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        // Remove project
                        const updatedProjects = user.profileProjects.filter((_, index) => index !== idx);
                        axiosInstance.patch("/user/profile/update", { profileProjects: updatedProjects })
                          .then(() => window.location.reload())
                          .catch(console.error);
                      }}
                      className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                  <div className="flex gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-16 h-16 rounded-lg object-cover border border-white/10"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{p.title}</div>
                      {p.description && (
                        <div className="text-sm text-gray-200/70 mt-1">{p.description}</div>
                      )}
                      {p.technologies && (
                        <div className="text-xs text-gray-400 mt-1">
                          {Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}
                        </div>
                      )}
                      {p.url && (
                        <a className="text-sm text-blue-300 hover:underline mt-1 inline-block" href={p.url} target="_blank" rel="noreferrer">
                          {p.url}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isOwnProfile ? (
          <div className="mt-4 p-4 bg-black/20 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-200/80">Projects</h3>
                <a 
                  href="/profile/projects" 
                  className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Add projects →
                </a>
              </div>
              <button
                onClick={() => setShowProfileSectionsModal(true)}
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                + Add
              </button>
            </div>
            <p className="text-gray-500 text-xs italic mt-2">
              <button
                onClick={() => setShowProfileSectionsModal(true)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Add your projects
              </button>
            </p>
          </div>
        ) : null}
      </div>
      
      {/* Connection Requests - Only show on own profile */}
      {isOwnProfile && (
        <div className="mt-6">
          <ConnectionRequests 
            currentUser={user}
            onConnectionUpdate={() => window.location.reload()}
          />
        </div>
      )}
      
      {/* Profile Sections Modal */}
      <ProfileSectionsModal
        user={user}
        isOpen={showProfileSectionsModal}
        onClose={() => setShowProfileSectionsModal(false)}
      />
      
      {/* Add Profile Section Modal */}
      <AddProfileSectionModal
        user={user}
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onUpdate={(data) => {
          if (data.activeTab === 'portfolio' && data.showAddProjectModal) {
            setShowAddProjectModal(true);
          } else {
            window.location.reload();
          }
        }}
      />
      
      {/* Add Project Modal */}
      <AddProjectModal
        user={user}
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onUpdate={window.location.reload}
      />
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditModalActiveTab(null);
        }}
        onUpdate={handleProfileUpdate}
        activeTab={editModalActiveTab}
      />
    </div>
  );
};

export default Information;
