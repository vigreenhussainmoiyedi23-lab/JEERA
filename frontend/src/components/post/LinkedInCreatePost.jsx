import React, { useState, useRef, useEffect } from "react";
import { 
  Image, 
  Video, 
  FileText, 
  Calendar, 
  Hash, 
  AtSign, 
  Globe, 
  Users, 
  Lock,
  Smile,
  Bold,
  Italic,
  List,
  Link2,
  BarChart3,
  X,
  Loader,
  Plus
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const LinkedInCreatePost = ({ setPosts, onClose }) => {
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    visibility: "public",
    hashtags: [],
    mentions: [],
    tags: [],
    industry: "",
    location: "",
    linkUrl: ""
  });
  const [media, setMedia] = useState([]);
  const [poll, setPoll] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [formData.content]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const extractHashtags = (text) => {
    const hashtags = text.match(/#\w+/g)?.map(tag => tag.substring(1).toLowerCase()) || [];
    setFormData(prev => ({ ...prev, hashtags }));
  };

  const extractMentions = (text) => {
    const mentions = text.match(/@\w+/g)?.map(mention => mention.substring(1)) || [];
    setFormData(prev => ({ ...prev, mentions }));
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData(prev => ({ ...prev, content }));
    extractHashtags(content);
    extractMentions(content);
  };

  const addPollOption = () => {
    setPoll(prev => ({
      ...prev,
      options: [...(prev?.options || []), { text: "", votes: [] }]
    }));
  };

  const updatePollOption = (index, text) => {
    setPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? { ...opt, text } : opt)
    }));
  };

  const removePollOption = (index) => {
    setPoll(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    const data = new FormData();
    data.append("content", formData.content);
    if (formData.title) data.append("title", formData.title);
    data.append("visibility", formData.visibility);
    data.append("hashtags", JSON.stringify(formData.hashtags));
    data.append("mentions", JSON.stringify(formData.mentions));
    data.append("tags", JSON.stringify(formData.tags));
    if (formData.industry) data.append("industry", formData.industry);
    if (formData.location) data.append("location", formData.location);
    if (formData.linkUrl) data.append("linkUrl", formData.linkUrl);
    
    if (poll && poll.question && poll.options.length > 0) {
      data.append("poll", JSON.stringify(poll));
    }
    
    if (article && article.title && article.content) {
      data.append("article", JSON.stringify(article));
    }

    media.forEach((file) => data.append("media", file));

    setLoading(true);
    try {
      const res = await axiosInstance.post("/post/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((prev) => [res.data.post, ...prev]);
      onClose?.();
    } catch (err) {
      console.error("Post creation failed:", err);
    }
    setLoading(false);
  };

  const visibilityOptions = [
    { value: "public", icon: Globe, label: "Anyone" },
    { value: "connections", icon: Users, label: "Connections only" },
    { value: "private", icon: Lock, label: "Only you" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 p-4">
      <div className="bg-slate-950 w-full max-w-2xl rounded-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create a post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">YU</span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a headline (optional)"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-transparent border-none text-white font-medium placeholder-gray-500 focus:outline-none mb-2"
              />
              <div className="flex items-center gap-2">
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="text-sm text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {visibilityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              placeholder="What do you want to talk about?"
              value={formData.content}
              onChange={handleContentChange}
              className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none resize-none min-h-24 text-[15px] leading-relaxed"
              rows={3}
            />
            
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 mt-3 text-gray-400">
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <List className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <Hash className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <AtSign className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-white/5 rounded transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {media.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('video/') ? (
                    <video className="w-full h-48 object-cover rounded-lg bg-black/20" />
                  ) : (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Link Preview */}
          {formData.linkUrl && (
            <div className="border border-white/10 rounded-lg p-3 bg-white/5">
              <div className="flex items-center gap-2 text-gray-400">
                <Link2 className="w-4 h-4" />
                <span className="text-sm">{formData.linkUrl}</span>
              </div>
            </div>
          )}

          {/* Poll */}
          {showPoll && (
            <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-3">
              <input
                type="text"
                placeholder="Ask a question..."
                value={poll?.question || ""}
                onChange={(e) => setPoll(prev => ({ ...prev, question: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              />
              {poll?.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                  />
                  {poll.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPollOption}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                + Add option
              </button>
            </div>
          )}

          {/* Add-ons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm">Media</span>
            </button>
            
            <button
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPoll ? "text-yellow-400 bg-yellow-400/10" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Poll</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAdvanced ? "text-yellow-400 bg-yellow-400/10" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">More</span>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <input
                type="url"
                placeholder="Add a link..."
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-xs text-gray-500">
              {formData.content.length}/3000 characters
            </div>
            <button
              type="submit"
              disabled={loading || !formData.content.trim()}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  Posting <Loader className="animate-spin w-4 h-4" />
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default LinkedInCreatePost;
