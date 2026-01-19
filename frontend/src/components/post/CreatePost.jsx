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
      className="bg-[#1b1f23] border border-gray-700 rounded-xl overflow-hidden shadow-sm max-w-4xl w-full mx-auto"
    >
      <h3 className="text-2xl font-bold text-yellow-300">Create Post</h3>

      {/* Title */}
      <input
        type="text"
        placeholder="Post title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-yellow-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {/* Description */}
      <textarea
        placeholder="Write your post..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-yellow-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[120px]"
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
        className="w-full bg-yellow-400 text-black py-2 rounded-full font-semibold hover:bg-yellow-500 transition flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            Posting <Loader className="animate-spin w-4 h-4" />
          </>
        ) : (
          "Post"
        )}
      </button>
    </form>
  );
};

export default CreatePost;
