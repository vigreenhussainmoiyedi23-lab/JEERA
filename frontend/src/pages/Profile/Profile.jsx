import React, { useState, useEffect } from "react";
import Information from "../../components/profile/Information";
import CreatePost from "../../components/profile/CreatePost";
import AllPosts from "../../components/profile/AllPosts";
import PostSuggestions from "../../components/profile/PostSuggestions";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);

  // Fetch user info
  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axiosInstance.get("/user/profile");
      setUser(userRes.data.user);

      const postRes = await axiosInstance.post("/post/feed", { postIds: [] });
      setSuggestedPosts(postRes.data.posts);

      // optionally fetch user’s own posts
      const ownPosts = await axiosInstance.get("/post/all");
      setPosts(ownPosts.data.posts);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-b  from-zinc-800 via-slate-950 to-gray-900 text-yellow-300 px-4 sm:px-8 py-10 space-y-10">
      {/* User Information */}
      <Information user={user} />

      {/* Create Post */}
      <CreatePost setPosts={setPosts} />

      {/* User’s All Posts */}
      <AllPosts posts={posts} user={user}/>

      {/* Suggested Posts */}
      <PostSuggestions posts={suggestedPosts} user={user}/>
    </div>
  );
};

export default Profile;
