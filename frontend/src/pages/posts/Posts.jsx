import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Hash,
  Newspaper,
  Plus,
  RefreshCcw,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import PostCard from "../../components/post/PostCard";

const Posts = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [sentPostIds, setSentPostIds] = useState([]);

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["profile-mini"],
    queryFn: async () => (await axiosInstance.get("/user/profile")).data,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: initialFeed,
    isLoading: isFeedLoading,
    isError: isFeedError,
    error: feedError,
    refetch: refetchFeed,
    isFetching: isFeedFetching,
  } = useQuery({
    queryKey: ["explore-feed"],
    queryFn: async () => (await axiosInstance.post("/post/feed", { postIds: [] })).data,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!initialFeed?.posts) return;
    setFeedPosts(initialFeed.posts);
    setSentPostIds(initialFeed.postIds || []);
  }, [initialFeed]);

  const user = profileData?.user;

  const canLoadMore = useMemo(() => {
    return Array.isArray(sentPostIds);
  }, [sentPostIds]);

  const loadMore = async () => {
    try {
      const res = await axiosInstance.post("/post/feed", { postIds: sentPostIds });
      const posts = res.data?.posts || [];
      const postIds = res.data?.postIds || [];

      setFeedPosts((prev) => [...prev, ...posts]);
      setSentPostIds((prev) => [...prev, ...postIds]);
    } catch (e) {
      console.error("Error loading more posts", e);
    }
  };

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

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore</h1>
              <p className="mt-1 text-sm text-gray-200/70">
                Discover posts across Jeera. A modern feed, LinkedIn-style.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => refetchFeed()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/5 px-4 py-2 text-sm text-gray-200/80 transition"
              >
                <RefreshCcw className={"h-4 w-4 " + (isFeedFetching ? "animate-spin" : "")} />
                Refresh
              </button>

              <Link
                to="/tasks"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_12px_35px_rgba(250,204,21,0.22)] hover:brightness-105 transition"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 items-start">
            {/* Left: Profile */}
            <aside className="lg:sticky lg:top-20">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="h-18 bg-linear-to-r from-indigo-500/20 via-sky-500/10 to-transparent" />
                <div className="p-5 -mt-10">
                  <div className="flex items-end gap-3">
                    <div className="h-16 w-16 rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <img
                        src={user?.profilePic?.url || "/user.png"}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-white truncate">
                        {isProfileLoading ? "Loading..." : user?.username || "User"}
                      </div>
                      <div className="text-xs text-gray-200/70 truncate">
                        {user?.email || ""}
                      </div>
                    </div>
                  </div>

                  {isProfileError && (
                    <p className="mt-3 text-xs text-red-400">
                      {profileError?.message || "Failed to load profile"}
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200/85 transition"
                    >
                      <Newspaper className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/projects"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200/85 transition"
                    >
                      <Briefcase className="h-4 w-4" />
                      Projects
                    </Link>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold text-gray-200/80">Quick tips</div>
                    <p className="mt-2 text-xs text-gray-200/65 leading-relaxed">
                      Use Explore to discover posts, learn from others, and collaborate.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Center: Feed */}
            <main className="min-w-0">
              {/* Mobile create task */}
              <div className="sm:hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-4 mb-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Create something</div>
                    <div className="text-xs text-gray-200/70">Post updates or add tasks</div>
                  </div>
                  <Link
                    to="/tasks"
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-400 px-4 py-2 text-xs font-semibold text-black"
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Link>
                </div>
              </div>

              <div className="space-y-5">
                {isFeedLoading && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-gray-200/80">
                    Loading feed...
                  </div>
                )}

                {isFeedError && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                    <p className="text-red-400 font-semibold">Error loading feed</p>
                    <p className="mt-1 text-sm text-gray-200/70">
                      {feedError?.message || "Something went wrong"}
                    </p>
                    <button
                      onClick={() => refetchFeed()}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/5 px-4 py-2 text-sm text-gray-200/80 transition"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Try again
                    </button>
                  </div>
                )}

                {!isFeedLoading && !isFeedError && feedPosts.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
                    <p className="text-white font-semibold">No posts yet</p>
                    <p className="mt-2 text-sm text-gray-200/70">
                      Create a post from your profile, or refresh to fetch new posts.
                    </p>
                  </div>
                )}

                {feedPosts.map((post) => (
                  <PostCard key={post._id} post={post} user={user} />
                ))}

                {!isFeedLoading && !isFeedError && feedPosts.length > 0 && (
                  <div className="flex items-center justify-center pt-2">
                    <button
                      onClick={loadMore}
                      disabled={!canLoadMore}
                      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-100 transition disabled:opacity-60"
                    >
                      Load more
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </main>

            {/* Right: Ads / Trends */}
            <aside className="lg:sticky lg:top-20">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-200/70" />
                  <div className="text-sm font-semibold text-white">Trending</div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-white/5 transition">
                    <div className="text-sm font-semibold text-white truncate">#productivity</div>
                    <div className="text-xs text-gray-200/70">Improve workflows & delivery</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-white/5 transition">
                    <div className="text-sm font-semibold text-white truncate">#uiux</div>
                    <div className="text-xs text-gray-200/70">Design systems & dark SaaS</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-white/5 transition">
                    <div className="text-sm font-semibold text-white truncate">#engineering</div>
                    <div className="text-xs text-gray-200/70">Build better, ship faster</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white">Sponsored</div>
                  <p className="mt-2 text-xs text-gray-200/70 leading-relaxed">
                    Upgrade your workflow with Jeera Teams — manage tasks, projects, and collaboration in one place.
                  </p>
                  <Link
                    to="/projects"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-xs font-semibold text-white transition"
                  >
                    View projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
