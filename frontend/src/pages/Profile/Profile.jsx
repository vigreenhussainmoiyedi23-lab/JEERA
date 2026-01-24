// import React, { useState, useEffect } from "react";
// import Information from "../../components/profile/Information";
// import CreatePost from "../../components/post/CreatePost";
// import AllPosts from "../../components/post/AllPosts";
// import PostSuggestions from "../../components/post/PostSuggestions";
// import axiosInstance from "../../utils/axiosInstance";
// import Navbar from "../../components/Navbar";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [suggestedPosts, setSuggestedPosts] = useState([]);

//   // Fetch user info and posts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userRes = await axiosInstance.get("/user/profile");
//         setUser(userRes.data.user);

//         const postRes = await axiosInstance.post("/post/feed", { postIds: [] });
//         setSuggestedPosts(postRes.data.posts || []);

//         const ownPosts = await axiosInstance.get("/post/all");
//         setPosts(ownPosts.data.posts || []);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="bg-linear-to-br overflow-x-hidden pt-5 flex md:flex-row flex-col   text-white min-h-screen h-max w-full relative from-zinc-800 via-slate-950 to-gray-900 px-5">
//         {/* User Information */}
//         <div className="flex flex-col items-center justify-start w-2/3 min-w-75 max-w-4xl  px-5 gap-5">
//           <Information user={user} />
//           {/* Create Post */}
//           <CreatePost setPosts={setPosts} />
//           {/* User’s All Posts */}
//           <AllPosts posts={posts} user={user} />
//           {/* Suggested Posts */}
//           <PostSuggestions posts={suggestedPosts} user={user} />
//         </div>
//         <div>
//           Advertises
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import Information from "../../components/profile/Information";
import CreatePost from "../../components/post/CreatePost";
import AllPosts from "../../components/post/AllPosts";
import PostSuggestions from "../../components/post/PostSuggestions";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);

  // Fetch user info and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/user/profile");
        setUser(userRes.data.user);

        const postRes = await axiosInstance.post("/post/feed", { postIds: [] });
        setSuggestedPosts(postRes.data.posts || []);

        const ownPosts = await axiosInstance.get("/post/all");
        setPosts(ownPosts.data.posts || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

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
              <Information user={user} />
              <CreatePost setPosts={setPosts} />
              <AllPosts posts={posts} user={user} />
              <PostSuggestions posts={suggestedPosts} user={user} />
            </div>

            <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-max sticky top-[10vh]">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white tracking-tight">Sponsored</h2>
                  <span className="text-xs text-gray-200/60">Ad</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition">
                    <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-yellow-400/20 to-amber-500/10 border border-white/10" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">Build your brand</div>
                      <div className="text-xs text-gray-200/70">Grow your online presence</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition">
                    <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-500/20 to-sky-500/10 border border-white/10" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">Hire top talent</div>
                      <div className="text-xs text-gray-200/70">Find your next teammate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 transition">
                    <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/10 border border-white/10" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">Level up skills</div>
                      <div className="text-xs text-gray-200/70">Learn faster with projects</div>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-300/60 text-center">
                  © {new Date().getFullYear()} Jeera · Privacy · Terms · Ads
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
