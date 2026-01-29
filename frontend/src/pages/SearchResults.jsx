import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users, User, Loader2, ArrowLeft } from 'lucide-react';
import axiosInstance from "../utils/axiosInstance";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      try {
        const response = await axiosInstance.get(`/user/search?q=${encodeURIComponent(query.trim())}`);
        setSearchResults(response.data.users || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (query) {
      searchUsers();
    }
  }, [query]);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen w-full relative text-white overflow-x-hidden">
        <div className="fixed top-0 z-0 inset-0 bg-slate-950" />
        <div className="fixed top-0 z-0 inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
        <div className="fixed top-0 z-0 inset-0 pointer-events-none">
          <div className="absolute -top-36 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-28 left-1/2 h-88 w-176 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] opacity-20" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/posts"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Search Results
              </h1>
              {query && (
                <span className="text-gray-400">
                  for "{query}"
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="ml-3 text-gray-400 text-lg">Searching users...</span>
              </div>
            ) : hasSearched && searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                <h2 className="text-xl font-semibold text-white mb-2">No users found</h2>
                <p className="text-gray-400">
                  Try searching with different keywords or check the spelling
                </p>
              </div>
            ) : hasSearched && searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400">
                    Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-yellow-400/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 group-hover:border-yellow-400/50 transition-colors">
                            <img
                              src={user.profilePic?.url || '/user.png'}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                            {user.username}
                          </h3>
                          <p className="text-sm text-gray-400 truncate mb-2">
                            {user.headline || 'No headline available'}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{user.followersCount || 0} followers</span>
                            {user.isFollowing && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                                Following
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">View profile</span>
                          <ArrowLeft className="w-3 h-3 text-gray-400 group-hover:text-yellow-400 transition-colors rotate-180" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : !query ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                <h2 className="text-xl font-semibold text-white mb-2">Start searching</h2>
                <p className="text-gray-400">
                  Use the search bar above to find users by username
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
