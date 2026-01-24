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
      <div className="bg-gradient-to-br from-zinc-800  via-slate-950 to-gray-900  pt-5 flex md:flex-row flex-col text-white min-h-screen h-max w-full relative px-5 gap-6">
        {/* Left Section - Main Content */}
        <div className="flex flex-col items-center justify-start w-full md:w-2/3 max-w-4xl px-5 gap-5">
          <Information user={user} />
          <CreatePost setPosts={setPosts} />
          <AllPosts posts={posts} user={user} />
          <PostSuggestions posts={suggestedPosts} user={user} />
        </div>

        {/* Right Section - Advertises */}
        <div className="hidden md:flex flex-col w-1/3 max-w-sm  h-max sticky top-[10vh] gap-4 p-4 rounded-xl bg-[#111827]/60 border border-gray-700 shadow-lg backdrop-blur-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            Sponsored
          </h2>

          <div className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer transition">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=80&h=80&fit=crop"
              alt="Build your brand"
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-100">
                Build your brand
              </h3>
              <p className="text-xs text-gray-400">
                Learn how to grow your online presence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer transition">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&h=80&fit=crop"
              alt="Hire top talent"
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-100">
                Hire top talent
              </h3>
              <p className="text-xs text-gray-400">
                Find professionals for your next project.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer transition">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=80&h=80&fit=crop"
              alt="Learn React & GSAP"
              className="w-12 h-12 rounded-md object-cover"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-100">
                Learn React & GSAP
              </h3>
              <p className="text-xs text-gray-400">
                Master frontend animation and effects.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            © {new Date().getFullYear()} YourCompany · Privacy · Terms · Ads
          </p>
        </div>

      </div>
    </>
  );
};

export default Profile;
