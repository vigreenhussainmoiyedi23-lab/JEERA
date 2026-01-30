import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { getRandomAds } from "../../config/ads";
// import Information from "../../components/profile/Information";
// import ProfileSections from "../../components/profile/ProfileSections";
// import SocialButtons from "../../components/profile/SocialButtons";
// import PostsSwiper from "../../components/profile/PostsSwiper";
// import LinkedInCreatePost from "../../components/post/LinkedInCreatePost";
// import LinkedInPostCard from "../../components/post/LinkedInPostCard";
import Navbar from "../../components/Navbar";
// Import new section components
import SkillsSection from "../../components/profile/sections/skills/SkillsSection";
import EducationSection from "../../components/profile/sections/education/EducationSection";
import ExperienceSection from "../../components/profile/sections/ExperienceSection";
import CertificationsSection from "../../components/profile/sections/CertificationsSection";
import ProjectsSection from "../../components/profile/sections/ProjectsSection";
import SocialButtons from "../../components/profile/connection/SocialButtons";
import ProfileSections from "../../components/profile/ProfileSectionAdder/ProfileSections";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [relationship, setRelationship] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [randomAds, setRandomAds] = useState([]);
  const isOwnProfile = !userId;

  // Initialize random ads on component mount
  useEffect(() => {
    const ads = getRandomAds('profileAds', 3);
    setRandomAds(ads);
  }, []);

  // Fetch user info and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOwnProfile) {
          const userRes = await axiosInstance.get("/user/profile");
          setUser(userRes.data.user);
          setRelationship(null);
        } else {
          const userRes = await axiosInstance.get(`/user/profile/view/${userId}`);
          setUser(userRes.data.user);
          setRelationship(userRes.data.relationship || null);
        }

        const postRes = await axiosInstance.post("/post/feed", { postIds: [] });
        setSuggestedPosts(postRes.data.posts || []);

        const ownPosts = await axiosInstance.get("/post/all");
        setPosts(ownPosts.data.posts || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, [isOwnProfile, userId]);

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Information
                user={user}
                isOwnProfile={isOwnProfile}
                relationship={relationship}
                onRelationshipChange={setRelationship}
              />
              
              {/* Social Buttons */}
              <SocialButtons 
                user={user} 
                isOwnProfile={isOwnProfile} 
                currentUserId={localStorage.getItem('userId')}
              />
              
              {/* Dynamic Profile Sections */}
              <SkillsSection 
                user={user} 
                isOwnProfile={isOwnProfile} 
                onSectionUpdate={() => window.location.reload()}
              />
              <EducationSection 
                user={user} 
                isOwnProfile={isOwnProfile} 
                onSectionUpdate={() => window.location.reload()}
              />
              <ExperienceSection 
                user={user} 
                isOwnProfile={isOwnProfile} 
                onSectionUpdate={() => window.location.reload()}
              />
              <CertificationsSection 
                user={user} 
                isOwnProfile={isOwnProfile} 
                onSectionUpdate={() => window.location.reload()}
              />
              <ProjectsSection 
                user={user} 
                isOwnProfile={isOwnProfile} 
                onSectionUpdate={() => window.location.reload()}
              />
              
              {isOwnProfile && (
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-4">
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-black/20 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {user?.username?.substring(0, 2).toUpperCase() || "YU"}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">Start a post</span>
                  </button>
                </div>
              )}
              
              {/* Profile Sections - Only show on own profile */}
              {isOwnProfile && (
                <ProfileSections user={user} isOwnProfile={isOwnProfile} />
              )}
              
              {/* Posts Swiper */}
              <PostsSwiper posts={posts} user={user} />
              
              {/* Suggested Posts */}
              {isOwnProfile && suggestedPosts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Suggested Posts</h3>
                  {suggestedPosts.map((post) => (
                    <LinkedInPostCard key={post._id} post={post} user={user} />
                  ))}
                </div>
              )}
            </div>

            <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-max sticky top-[10vh]">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white tracking-tight">Sponsored</h2>
                  <span className="text-xs text-gray-200/60">Ad</span>
                </div>

                <div className="mt-4 space-y-3">
                  {randomAds.map((ad) => (
                    <div key={ad.id} className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition">
                      <div className={`h-10 w-10 rounded-2xl bg-linear-to-br ${ad.bgColor} ${ad.borderColor}`} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{ad.title}</div>
                        <div className="text-xs text-gray-200/70">{ad.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-xs text-gray-300/60 text-center">
                  © {new Date().getFullYear()} Jeera · Privacy · Terms · Ads
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <LinkedInCreatePost
          setPosts={setPosts}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </>
  );
};

export default Profile;
