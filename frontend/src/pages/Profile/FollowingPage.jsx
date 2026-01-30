import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';

const FollowingPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  console.log('FollowingPage - userId from params:', userId);
  console.log('FollowingPage - userId type:', typeof userId);
  console.log('FollowingPage - userId truthy:', !!userId);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      console.log('Fetching following for userId:', userId);
      
      const response = await axiosInstance.get(`/user/social/following`);
      setFollowing(response.data.data);
      
      // Also fetch user details to get user info
      // Use the correct profile endpoint based on whether it's own profile or another user's
      let userResponse;
      if (userId) {
        console.log('Fetching user profile for userId:', userId);
        try {
          userResponse = await axiosInstance.get(`/user/profile/view/${userId}`);
        } catch (profileError) {
          console.error('Profile view endpoint failed, trying fallback:', profileError);
          // Fallback: try to get user info from the following data
          if (response.data.data && response.data.data.length > 0) {
            // Use the first followed user's info as fallback
            setUser(response.data.data[0]);
            return;
          }
          throw profileError;
        }
      } else {
        userResponse = await axiosInstance.get("/user/profile");
      }
      
      setUser(userResponse.data.user);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await axiosInstance.delete(`/user/social/unfollow/${followingId}`);
      // Remove from local state
      setFollowing(following.filter(person => person._id !== followingId));
      alert('Unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing:', error);
      alert('Failed to unfollow');
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
            {user?.username}'s Following
          </h1>
          <span className="text-gray-400">
            ({following.length} following)
          </span>
        </div>

        {/* Following List */}
        <div className="space-y-4">
          {following.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Not following anyone yet</h3>
              <p className="text-gray-400">
                {user?._id === localStorage.getItem('userId') 
                  ? "Start following people to see them here"
                  : "This user isn't following anyone yet"
                }
              </p>
            </div>
          ) : (
            following.map((person) => (
              <div
                key={person._id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={person.profilePic?.url || `https://ui-avatars.com/api/?name=${person.username}&background=random`}
                    alt={person.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {person.fullName || person.username}
                    </h3>
                    <p className="text-gray-400">@{person.username}</p>
                    {person.bio && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {person.bio}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleUnfollow(person._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Unfollow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default FollowingPage;
