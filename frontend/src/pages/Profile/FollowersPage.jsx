import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserMinus, UserPlus } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';

const FollowersPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/social/followers`);
      setFollowers(response.data.data);
      
      // Also fetch user details to get user info
      // Use the correct profile endpoint based on whether it's own profile or another user's
      const userResponse = await axiosInstance.get(userId ? `/user/profile/view/${userId}` : "/user/profile");
      setUser(userResponse.data.user);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followerId) => {
    try {
      await axiosInstance.delete(`/user/social/unfollow/${followerId}`);
      // Remove from local state
      setFollowers(followers.filter(follower => follower._id !== followerId));
      alert('Unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing:', error);
      alert('Failed to unfollow');
    }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      await axiosInstance.delete(`/user/social/remove-follower/${followerId}`);
      // Remove from local state
      setFollowers(followers.filter(follower => follower._id !== followerId));
      alert('Follower removed successfully');
    } catch (error) {
      console.error('Error removing follower:', error);
      alert('Failed to remove follower');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 w-full relative text-white overflow-x-hidden">
        <div className="fixed top-0 z-0 inset-0 bg-slate-950" />
        <div className="fixed top-0 z-0 inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
        <div className="fixed top-0 z-0 inset-0 pointer-events-none">
          <div className="absolute -top-36 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-28 left-1/2 h-88 w-176 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] opacity-20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">
            {user?.username}'s Followers
          </h1>
          <span className="text-gray-400">
            ({followers.length} followers)
          </span>
        </div>

        {/* Followers List */}
        <div className="space-y-4">
          {followers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No followers yet</h3>
              <p className="text-gray-400">
                {user?._id === localStorage.getItem('userId') 
                  ? "Start building your network to see followers here"
                  : "This user doesn't have any followers yet"
                }
              </p>
            </div>
          ) : (
            followers.map((follower) => (
              <div
                key={follower._id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={follower.profilePic?.url || `https://ui-avatars.com/api/?name=${follower.username}&background=random`}
                    alt={follower.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {follower.fullName || follower.username}
                    </h3>
                    <p className="text-gray-400">@{follower.username}</p>
                    {follower.bio && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {follower.bio}
                      </p>
                    )}
                  </div>
                </div>

                {follower._id === localStorage.getItem('userId') ? (
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                      You
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUnfollow(follower._id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                      Unfollow
                    </button>
                    <button
                      onClick={() => handleRemoveFollower(follower._id)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default FollowersPage;
