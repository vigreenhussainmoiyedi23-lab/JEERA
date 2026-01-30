import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Loader2, Users } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axiosInstance.post(`/user/profile/search`, {
          username: searchQuery.trim()
        });
        setSearchResults(response.data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
          placeholder="Search users..."
          className="w-full pl-10 pr-10 py-2.5 bg-black/20 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:bg-white/5 transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown - Instagram Style */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="ml-2 text-gray-400 text-sm">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center p-6 text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">
                  No user found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try a different username
                </p>
              </div>
            ) : (
              <div className="py-2">
                {/* Header */}
                <div className="px-4 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <Users className="w-3 h-3" />
                    Users ({searchResults.length})
                  </div>
                </div>
                
                {/* User List */}
                <div className="divide-y divide-slate-700/50">
                  {searchResults.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      onClick={handleUserClick}
                      className="flex items-center gap-3 p-3 hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 group-hover:border-yellow-400/50 transition-colors">
                          <img
                            src={user.profilePic?.url || '/user.png'}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Online indicator (optional) */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                            {user.username}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {user.headline || 'No headline'}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {user.followersCount || 0} followers
                          </span>
                          {user.isFollowing && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                              Following
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs text-gray-400">
                          View Profile →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-700">
                  <button 
                    onClick={() => {
                      // Navigate to full search results page
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
