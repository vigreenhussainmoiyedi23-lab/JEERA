import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreHorizontal,
  X,
  Copy,
  MessageCircle,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  Briefcase,
  Hash,
  AtSign,
  Users,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import CommentSection from "./CommentSection";

const LinkedInPostCard = ({ post, user }) => {
  const navigate = useNavigate();
  const [openComments, setOpenComments] = useState(false);
  const [liked, setLiked] = useState(post.engagement?.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.engagement?.likes?.length || 0);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [viewCount, setViewCount] = useState(post.engagement?.views || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [pollData, setPollData] = useState(post.poll ? {
    ...post.poll,
    options: post.poll.options.map(opt => ({
      ...opt,
      percentage: 0,
      hasVoted: opt.votes?.includes(user?._id) || false
    }))
  } : null);
  const [voting, setVoting] = useState(false);

  // Track view when post is rendered
  useEffect(() => {
    const trackView = async () => {
      try {
        const { data } = await axiosInstance.patch(`/post/view/${post._id}`);
        setViewCount(data.views);
      } catch (err) {
        // Silently fail for view tracking to not disrupt UX
      }
    };

    // Only track view if user is authenticated and it's not their own post
    if (user && post.createdBy?._id !== user._id) {
      trackView();
    }
  }, [post._id, user, post.createdBy?._id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest('.relative')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  const handleLinkClick = async (e) => {
    // Track the click in the background
    try {
      await axiosInstance.patch(`/post/click/${post._id}`);
    } catch (err) {
      console.error("Failed to track link click:", err);
    }
    // Let the default link behavior proceed
  };

  const handlePollVote = async (optionIndex) => {
    if (voting || !pollData) return;
    
    setVoting(true);
    try {
      const { data } = await axiosInstance.patch(`/post/vote/${post._id}`, {
        optionIndex
      });
      
      setPollData(data.poll);
    } catch (err) {
      console.error("Poll vote failed:", err);
    } finally {
      setVoting(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosInstance.patch(`/post/likeUnlike/${post._id}`);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public": return <Globe className="w-3 h-3" />;
      case "connections": return <Users className="w-3 h-3" />;
      case "private": return <Lock className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const truncateContent = (content, maxLength = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const displayContent = showFullContent ? post.content : truncateContent(post.content);

  return (
    <div className="relative mb-4">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/8 via-white/4 to-transparent" />
      <div className="relative rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_70px_rgba(0,0,0,0.45)] transition-shadow overflow-hidden">
        
        {/* Header */}
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate(`/profile/${post.createdBy?._id}`)}
                className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                {post.createdBy?.profilePic?.url ? (
                  <img
                    src={post.createdBy.profilePic.url}
                    alt={post.createdBy.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-black font-bold">
                    {post.createdBy?.username?.substring(0, 2).toUpperCase() || "YU"}
                  </span>
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/profile/${post.createdBy?._id}`)}
                    className="font-semibold text-white hover:text-yellow-400 transition-colors"
                  >
                    {post.createdBy?.username || "Unknown User"}
                  </button>
                  {post.createdBy?.headline && (
                    <span className="text-gray-400 text-sm">• {post.createdBy.headline}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {getVisibilityIcon(post.visibility)}
                    <span className="capitalize">{post.visibility}</span>
                  </div>
                  {post.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {/* Dropdown Menu */}
              {showOptions && (
                <div className="absolute top-8 right-0 bg-slate-900 border border-white/10 rounded-lg shadow-lg py-2 z-50 min-w-40">
                  {post.createdBy?._id === user?._id && (
                    <button
                      onClick={() => {
                        navigate(`/analytics/post/${post._id}`);
                        setShowOptions(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Analytics</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowOptions(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <div className="px-5 pt-3">
            <h2 className="text-lg font-semibold text-white">{post.title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-3">
          <div className="text-gray-200/90 text-[15px] leading-relaxed">
            {displayContent}
            {post.content.length > 300 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-yellow-400 hover:text-yellow-300 font-medium ml-1"
              >
                {showFullContent ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          
          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.hashtags.map((tag, index) => (
                <span key={index} className="text-yellow-400 hover:text-yellow-300 cursor-pointer text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Industry */}
          {post.industry && (
            <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
              <Briefcase className="w-4 h-4" />
              <span>{post.industry}</span>
            </div>
          )}
        </div>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="border-y border-white/10 bg-black/20">
            {post.media.length === 1 ? (
              <div className="relative">
                {post.media[0].type === "video" ? (
                  <video 
                    src={post.media[0].url} 
                    controls 
                    className="w-full max-h-96 object-cover"
                  />
                ) : (
                  <img 
                    src={post.media[0].url} 
                    alt="Post media" 
                    className="w-full max-h-96 object-cover"
                  />
                )}
              </div>
            ) : (
              <div className={`grid ${
                post.media.length === 2 ? "grid-cols-2" : 
                post.media.length === 3 ? "grid-cols-3" : 
                "grid-cols-2"
              } gap-1`}>
                {post.media.slice(0, 4).map((item, index) => (
                  <div key={index} className="relative">
                    {item.type === "video" ? (
                      <video src={item.url} className="w-full h-48 object-cover" />
                    ) : (
                      <img src={item.url} alt="Post media" className="w-full h-48 object-cover" />
                    )}
                    {post.media.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">+{post.media.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Poll */}
        {pollData && (
          <div className="border-y border-white/10 bg-black/20 p-4">
            <h4 className="font-medium text-white mb-3">{pollData.question}</h4>
            <div className="space-y-2">
              {pollData.options.map((option, index) => {
                const totalVotes = pollData.options.reduce((sum, opt) => sum + (Array.isArray(opt.votes) ? opt.votes.length : opt.votes || 0), 0);
                const optionVotes = Array.isArray(option.votes) ? option.votes.length : option.votes || 0;
                const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                const hasVoted = option.hasVoted;
                
                return (
                  <button
                    key={index}
                    onClick={() => handlePollVote(index)}
                    disabled={voting}
                    className="w-full text-left group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {/* Progress bar */}
                    {percentage > 0 && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-yellow-400/20 border-r border-yellow-400/30 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    
                    <div className="relative p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          hasVoted 
                            ? 'bg-yellow-400 border-yellow-400' 
                            : 'border-gray-400 group-hover:border-yellow-400'
                        }`}>
                          {hasVoted && (
                            <div className="w-2 h-2 bg-black rounded-full" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          hasVoted ? 'text-white font-medium' : 'text-gray-200'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {optionVotes} vote{optionVotes !== 1 ? 's' : ''}
                        </span>
                        {percentage > 0 && (
                          <span className="text-xs font-medium text-yellow-400">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Poll footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{pollData.options.reduce((sum, opt) => sum + (Array.isArray(opt.votes) ? opt.votes.length : opt.votes || 0), 0)} votes</span>
              {pollData.expiresAt && (
                <span>Ends {new Date(pollData.expiresAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}

        {/* Link Preview */}
        {post.linkPreview && (
          <a 
            href={post.linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="block border-y border-white/10 bg-black/20 p-4 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              {post.linkPreview.image && (
                <img 
                  src={post.linkPreview.image} 
                  alt={post.linkPreview.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">{post.linkPreview.siteName}</div>
                <h4 className="font-medium text-white truncate">{post.linkPreview.title}</h4>
                <p className="text-sm text-gray-400 line-clamp-2">{post.linkPreview.description}</p>
              </div>
            </div>
          </a>
        )}

        {/* Engagement Stats */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1 group cursor-pointer">
              <div className="flex -space-x-1">
                <div className="bg-blue-500 rounded-full p-0.5 border border-black/30">
                  <ThumbsUp size={10} className="text-white fill-white" />
                </div>
              </div>
              <span className="hover:text-blue-300 hover:underline">
                {likeCount}
              </span>
            </div>
            <div className="hover:text-blue-300 hover:underline cursor-pointer">
              {post.commentCount || 0} comments
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-2 py-1.5 flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/5 transition-colors ${
              liked ? "text-blue-400" : "text-gray-400"
            }`}
          >
            <ThumbsUp size={20} className={liked ? "fill-blue-400" : ""} />
            <span className="font-semibold text-sm">Like</span>
          </button>

          <button
            onClick={() => setOpenComments(!openComments)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400"
          >
            <MessageSquare size={20} />
            <span className="font-semibold text-sm">Comment</span>
          </button>

          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400"
          >
            <Share2 size={20} />
            <span className="font-semibold text-sm">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {openComments && (
          <CommentSection postId={post._id} user={user} />
        )}
      </div>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowShareMenu(false)}>
          <div className="bg-gray-900 w-full sm:w-100 rounded-t-2xl sm:rounded-2xl p-5 animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Share post</h3>
              <button onClick={() => setShowShareMenu(false)}>
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <button
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.origin + '/post/' + post._id)}`, "_blank");
                  setShowShareMenu(false);
                }}
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <FaWhatsapp className="text-green-500 text-3xl" />
                <span className="text-xs">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white hover:scale-105 transition">
                <FaInstagram className="text-pink-500 text-3xl" />
                <span className="text-xs">Instagram</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white hover:scale-105 transition">
                <MessageCircle className="text-blue-400 w-8 h-8" />
                <span className="text-xs">Messages</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/post/' + post._id);
                  setShowShareMenu(false);
                }}
                className="flex flex-col items-center gap-2 text-white hover:scale-105 transition"
              >
                <Copy className="text-yellow-400 w-8 h-8" />
                <span className="text-xs">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInPostCard;
