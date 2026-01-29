import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  MessageSquare,
  ThumbsUp,
  Calendar,
  BarChart3,
  Users,
  Clock,
  Filter
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const PostAnalytics = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetrics, setSelectedMetrics] = useState(["likes", "views", "comments"]);

  const timeRanges = [
    { value: "24hours", label: "Last 24 Hours", icon: Clock },
    { value: "7days", label: "Last 7 Days", icon: Calendar },
    { value: "30days", label: "Last 30 Days", icon: Calendar },
    { value: "today", label: "Today", icon: Calendar },
    { value: "yesterday", label: "Yesterday", icon: Calendar },
    { value: "thisWeek", label: "This Week", icon: Calendar },
    { value: "thisMonth", label: "This Month", icon: BarChart3 }
  ];

  const metrics = [
    { key: "likes", label: "Likes", color: "#3B82F6", icon: ThumbsUp },
    { key: "views", label: "Views", color: "#EAB308", icon: Eye },
    { key: "comments", label: "Comments", color: "#EF4444", icon: MessageSquare }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [postId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/analytics/post/${postId}/analytics?timeRange=${timeRange}`);
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { post, summary, data } = analytics;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Post Analytics</h1>
                <p className="text-gray-400 text-sm">{post.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <ThumbsUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(summary.likes)}</div>
            <div className="text-sm text-gray-400">Likes</div>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-yellow-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(summary.views)}</div>
            <div className="text-sm text-gray-400">Views</div>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-red-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(summary.comments)}</div>
            <div className="text-sm text-gray-400">Comments</div>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-xs text-gray-400">Rate</span>
            </div>
            <div className="text-2xl font-bold">{summary.engagement}%</div>
            <div className="text-sm text-gray-400">Engagement</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Time Range Selector */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">Time Range</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {timeRanges.map((range) => {
                const Icon = range.icon;
                return (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      timeRange === range.value
                        ? "bg-yellow-400 text-black"
                        : "bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{range.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metrics Selector */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">Metrics</h3>
            </div>
            <div className="flex gap-2">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const isSelected = selectedMetrics.includes(metric.key);
                return (
                  <button
                    key={metric.key}
                    onClick={() => toggleMetric(metric.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-white/10 border border-white/20"
                        : "bg-white/5 hover:bg-white/10 border border-transparent"
                    }`}
                    style={{
                      borderColor: isSelected ? metric.color : undefined
                    }}
                  >
                    <Icon 
                      className="w-4 h-4" 
                      style={{ color: isSelected ? metric.color : undefined }}
                    />
                    <span>{metric.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Performance Over Time</h3>
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Legend />
                  {selectedMetrics.includes("likes") && (
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedMetrics.includes("views") && (
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#EAB308"
                      strokeWidth={2}
                      dot={{ fill: "#EAB308", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedMetrics.includes("comments") && (
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No data available for the selected time range</p>
              <p className="text-xs mt-2">Try selecting a different time range</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAnalytics;
