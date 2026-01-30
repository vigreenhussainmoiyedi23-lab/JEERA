import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Link2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const SocialButtons = ({ user, isOwnProfile, currentUserId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Don't render if user data is not available yet
  if (!user) {
    return (
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-gray-400 rounded-lg">
          <Users className="w-4 h-4" />
          <span className="font-medium">0</span>
          <span className="text-sm">Followers</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-gray-400 rounded-lg">
          <UserPlus className="w-4 h-4" />
          <span className="font-medium">0</span>
          <span className="text-sm">Following</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-gray-400 rounded-lg">
          <Link2 className="w-4 h-4" />
          <span className="font-medium">0</span>
          <span className="text-sm">Connections</span>
        </div>
      </div>
    );
  }

  const handleFollowersClick = () => {
    navigate(`/profile/${user._id}/followers`);
  };

  const handleFollowingClick = () => {
    navigate(`/profile/${user._id}/following`);
  };

  const handleConnectionsClick = () => {
    navigate(`/profile/${user._id}/connections`);
  };

  const handleConnect = async () => {
    if (!isOwnProfile) {
      try {
        setLoading(true);
        await axiosInstance.post(`/user/social/connect/${user._id}`);
        alert('Connection request sent successfully!');
        // You might want to refresh the user data here
      } catch (error) {
        console.error('Error sending connection request:', error);
        alert(error.response?.data?.message || 'Failed to send connection request');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={handleFollowersClick}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        <Users className="w-4 h-4" />
        <span className="font-medium">{user.followers?.length || 0}</span>
        <span className="text-sm text-gray-300">Followers</span>
      </button>

      <button
        onClick={handleFollowingClick}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        <span className="font-medium">{user.following?.length || 0}</span>
        <span className="text-sm text-gray-300">Following</span>
      </button>

      <button
        onClick={handleConnectionsClick}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        <Link2 className="w-4 h-4" />
        <span className="font-medium">{user.connections?.length || 0}</span>
        <span className="text-sm text-gray-300">Connections</span>
      </button>

      {!isOwnProfile && (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span className="font-medium">
            {loading ? 'Sending...' : 'Connect'}
          </span>
        </button>
      )}
    </div>
  );
};

export default SocialButtons;
