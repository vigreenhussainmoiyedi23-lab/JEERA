import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const CreatePost = ({ setPosts }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    images.forEach((img) => data.append("images", img));

    setLoading(true);
    try {
      const res = await axiosInstance.post("/post/create", data);
      setPosts((prev) => [res.data.post, ...prev]);
      setFormData({ title: "", description: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/30 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4"
    >
      <h3 className="text-2xl font-bold text-yellow-300">Create Post</h3>
      <input
        type="text"
        placeholder="Post title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <textarea
        placeholder="Write your post..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[100px]"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="text-gray-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 text-black py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;
