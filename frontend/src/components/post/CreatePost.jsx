import React, { useState } from "react";
import { Image, Loader } from "lucide-react";
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
      const res = await axiosInstance.post("/post/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      encType="multipart/form-data"
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] w-full overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Create a post</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-200/60">Share an update with your network</p>
      </div>

      <div className="p-5 space-y-4">

      {/* Title */}
      <input
        type="text"
        placeholder="Post title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-gray-100 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition"
      />

      {/* Description */}
      <textarea
        placeholder="Write your post..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-gray-100 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition min-h-30"
      />

      {/* Image Upload */}
      <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-yellow-400 transition">
        <Image />
        <span>
          {images.length > 0
            ? `${images.length} image(s) selected`
            : "Add images"}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 text-black py-3 rounded-2xl font-semibold hover:bg-yellow-500 transition flex justify-center items-center gap-2 shadow-[0_12px_30px_rgba(250,204,21,0.16)] disabled:opacity-60 disabled:cursor-not-allowed"
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
  );
};

export default CreatePost;
