import { Edit2, MapPin, Link as LinkIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import EditProfileModal from "./EditProfileModal";
import AddProfileSectionModal from "./AddProfileSectionModal";
import AddProjectModal from "./AddProjectModal";
import ProfileSectionsModal from "./ProfileSectionAdder/ProfileSectionsModal";
import ConnectionRequests from "./ConnectionRequests";
import InviteButton from "./InviteButton";

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
    try {
      setUploadingBanner(true);
      const formData = new FormData();
      formData.append('banner', file);
      
      const response = await axiosInstance.post('/user/profile/upload-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      user.profileBanner = response.data.profileBanner;
      window.location.reload();
    } catch (error) {
      console.error('Error uploading banner:', error);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleProfilePicUpload = async (file) => {
    try {
      setUploadingProfilePic(true);
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const response = await axiosInstance.post('/user/profile/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      user.profilePic = response.data.profilePic;
      window.location.reload();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const handleDeleteBanner = async () => {
    try {
      await axiosInstance.delete('/user/profile/delete-banner');
      user.profileBanner = null;
      window.location.reload();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      await axiosInstance.delete('/user/profile/delete-profile-pic');
      user.profilePic = null;
      window.location.reload();
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (isOwnProfile || !user?._id) return;
    try {
      setIsUpdatingRelation(true);
      const { data } = await axiosInstance.post(`/user/profile/follow/${user._id}`);
      onRelationshipChange?.((prev) => ({
        ...(prev || {}),
        isFollowing: data.isFollowing ?? prev?.isFollowing,
        followersCount: data.followersCount ?? prev?.followersCount,
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

  // Create location text
  const locationText = user.location?.city && user.location?.country 
    ? `${user.location.city}, ${user.location.country}`
    : user.location?.city || user.location?.country || null;

  const followersCount = user.followers?.length || 0;

  return (
    <>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={(el) => (window.bannerInputRef = el)}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleBannerUpload(e.target.files[0])}
      />
      <input
        type="file"
        ref={(el) => (window.profilePicInputRef = el)}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleProfilePicUpload(e.target.files[0])}
      />

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* 1. Banner Image */}
        <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          {user.profileBanner?.url ? (
            <>
              <img
                src={user.profileBanner.url}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
              
              {/* Upload/Delete overlay - Only for own profile */}
              {isOwnProfile && (
                <div 
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => window.bannerInputRef?.click()}
                >
                  <div className="text-center">
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
                  </div>
                </div>
              )}
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center hover:bg-black/20 transition-colors"
              onClick={() => isOwnProfile && window.bannerInputRef?.click()}
            >
              <div className="text-center">
                <div className="text-white/70 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 011.664.89l.812 1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 00-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-white font-medium">
                  {isOwnProfile ? "Add banner" : "No banner"}
                </p>
                <p className="text-white/70 text-sm">
                  {isOwnProfile ? "Click to upload" : ""}
                </p>
              </div>
            </div>
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
                  {!isOwnProfile && (
                    <InviteButton 
                      targetUserId={user._id} 
                      targetUsername={user.username} 
                    />
                  )}
                </>
              )}
            </div>
          </div>
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
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          user={user}
        />
        
        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            user={user}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleProfileUpdate}
            activeTab={editModalActiveTab}
          />
        )}
      </div>
    </>
  );
};

export default Information;
