import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2, UserMinus, UserPlus, Clock, Check, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/Navbar';

const ConnectionsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'connections') {
      fetchConnections();
    } else {
      fetchConnectionRequests();
    }
  }, [activeTab, userId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/social/connections`);
      setConnections(response.data.data);
      
      const userResponse = await axiosInstance.get(userId ? `/user/profile/view/${userId}` : "/user/profile");
      setUser(userResponse.data.user);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/social/connection-requests`);
      setConnectionRequests(response.data.data);
      
      const userResponse = await axiosInstance.get(userId ? `/user/profile/view/${userId}` : "/user/profile");
      setUser(userResponse.data.user);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.put(`/user/social/accept-connection/${requestId}`);
      // Remove from requests and add to connections
      const request = connectionRequests.find(req => req._id === requestId);
      if (request) {
        setConnectionRequests(connectionRequests.filter(req => req._id !== requestId));
        setConnections([...connections, request.from]);
      }
      alert('Connection request accepted');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axiosInstance.delete(`/user/social/reject-connection/${requestId}`);
      setConnectionRequests(connectionRequests.filter(req => req._id !== requestId));
      alert('Connection request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject connection request');
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      await axiosInstance.delete(`/user/social/remove-connection/${connectionId}`);
      setConnections(connections.filter(conn => conn._id !== connectionId));
      alert('Connection removed successfully');
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Failed to remove connection');
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">
              {user?.username}'s Network
            </h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'connections'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Link2 className="w-4 h-4 inline mr-2" />
              Connections ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-md transition-colors relative ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Requests ({connectionRequests.length})
              {connectionRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'connections' ? (
          <div className="space-y-4">
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No connections yet</h3>
                <p className="text-gray-400">
                  Start building your professional network
                </p>
              </div>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={connection.profilePic?.url || `https://ui-avatars.com/api/?name=${connection.username}&background=random`}
                      alt={connection.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {connection.fullName || connection.username}
                      </h3>
                      <p className="text-gray-400">@{connection.username}</p>
                      {connection.bio && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {connection.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveConnection(connection._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {connectionRequests.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No pending requests</h3>
                <p className="text-gray-400">
                  You'll see connection requests here
                </p>
              </div>
            ) : (
              connectionRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={request.from.profilePic?.url || `https://ui-avatars.com/api/?name=${request.from.username}&background=random`}
                      alt={request.from.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {request.from.fullName || request.from.username}
                      </h3>
                      <p className="text-gray-400">@{request.from.username}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;
