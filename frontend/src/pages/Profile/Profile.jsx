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
      <div className="bg-linear-to-br overflow-x-hidden pt-5  text-white min-h-screen w-full relative from-zinc-800 via-slate-950 to-gray-900 px-5">
        {/* User Information */}
        <div className="flex flex-col items-center justify-start w-full max-w-4xl absolute md:left-[10vw] left-0 px-5 gap-5">
          <Information user={user} />
          {/* Create Post */}
          <CreatePost setPosts={setPosts} />
          {/* User’s All Posts */}
          <AllPosts posts={posts} user={user} />
          {/* Suggested Posts */}
          <PostSuggestions posts={suggestedPosts} user={user} />
        </div>
      </div>
    </>
  );
};

export default Profile;
