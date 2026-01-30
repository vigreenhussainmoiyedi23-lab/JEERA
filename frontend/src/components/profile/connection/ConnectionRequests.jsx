import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Check, 
  X, 
  Clock,
  Briefcase,
  MapPin
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const ConnectionRequests = ({ currentUser, onConnectionUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    fetchConnectionRequests();
  }, []);
  

  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      // Get users who sent connection requests to current user
      const { data } = await axiosInstance.get('/user/profile');
      const requestIds = data.user.connectionRequestsReceived || [];
      
      if (requestIds.length === 0) {
        setRequests([]);
        return;
      }

      // Fetch details of users who sent requests
      const userDetails = await Promise.all(
        requestIds.map(async (userId) => {
          const { data: profileData } = await axiosInstance.get(`/user/profile/view/${userId}`);
          return {
            ...profileData.user,
            requestId: userId
          };
        })
      );

      setRequests(userDetails);
    } catch (error) {
      console.error('Failed to fetch connection requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      setProcessing(prev => new Set(prev).add(requesterId));
      await axiosInstance.post(`/user/profile/connect/${requesterId}`);
      
      // Remove from requests list
      setRequests(prev => prev.filter(req => req._id !== requesterId));
      
      // Notify parent component
      onConnectionUpdate?.();
    } catch (error) {
      console.error('Failed to accept connection request:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(requesterId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requesterId) => {
    try {
      setProcessing(prev => new Set(prev).add(requesterId));
      // To reject, we send a connect request (which will cancel the existing one)
      await axiosInstance.post(`/user/profile/connect/${requesterId}`);
      
      // Remove from requests list
      setRequests(prev => prev.filter(req => req._id !== requesterId));
      
      // Notify parent component
      onConnectionUpdate?.();
    } catch (error) {
      console.error('Failed to reject connection request:', error);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(requesterId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
        <div className="text-center py-8">
          <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">No pending requests</h3>
          <p className="text-sm text-gray-500">Connection requests will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Connection Requests</h3>
          <p className="text-sm text-gray-400 mt-1">
            {requests.length} pending request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 text-blue-400">
          <UserPlus className="w-5 h-5" />
          <span className="text-sm font-medium">{requests.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((requester) => (
          <div
            key={requester._id}
            className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-4 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Profile Picture */}
              <div className="shrink-0">
                {requester.profilePic?.url ? (
                  <img
                    src={requester.profilePic.url}
                    alt={requester.username}
                    className="w-12 h-12 rounded-full object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {requester.username?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {requester.username}
                    </h4>
                    {requester.headline && (
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {requester.headline}
                      </p>
                    )}
                    
                    {/* Additional Info */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {requester.location?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {requester.location.city}
                        </span>
                      )}
                      {requester.openToWork && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                          Open to work
                        </span>
                      )}
                    </div>

                    {/* Mutual Connections */}
                    {requester.mutualConnections > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
                        <Briefcase className="w-3 h-3" />
                        {requester.mutualConnections} mutual connection{requester.mutualConnections !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(requester._id)}
                      disabled={processing.has(requester._id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-24"
                    >
                      {processing.has(requester._id) ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(requester._id)}
                      disabled={processing.has(requester._id)}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 min-w-24"
                    >
                      {processing.has(requester._id) ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Ignore
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {requests.length > 3 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all {requests.length} requests
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;
