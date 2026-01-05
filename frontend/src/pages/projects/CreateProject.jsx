import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectDets, setProjectDets] = useState({
    title: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  // ✅ useMutation is meant for POST/PUT/DELETE requests
  const createProject = useMutation({
    mutationFn: async (newProject) =>
      (await axiosInstance.post("/project/create", newProject)).data,
    onSuccess: (data) => {
      navigate(`/project/${data.project._id}`);
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    },
  });

  const SubmitHandler = (e) => {
    e.preventDefault();
    createProject.mutate(projectDets);
  };

  return (
    <>
      <Navbar />

      <div className="bg-linear-to-br from-zinc-800 via-slate-950 to-gray-900 text-white min-h-screen w-full flex justify-center items-center px-4 py-10 overflow-x-hidden">
        <form
          onSubmit={SubmitHandler}
          className="w-full max-w-md bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 sm:space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300">
              Create New Project
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Fill in the details below to start your new project.
            </p>
          </div>

          {/* Title Field */}
          <div className="w-full">
            <label
              htmlFor="title"
              className="block text-sm sm:text-base font-medium text-gray-300 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={projectDets.title}
              onChange={(e) =>
                setProjectDets({ ...projectDets, title: e.target.value })
              }
              minLength={3}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="Enter project name"
            />
          </div>

          {/* Description Field */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="block text-sm sm:text-base font-medium text-gray-300 mb-2"
            >
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={projectDets.description}
              onChange={(e) =>
                setProjectDets({ ...projectDets, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="Enter project description"
            ></textarea>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-400 text-sm sm:text-base font-medium bg-red-900/30 border border-red-700 rounded-lg p-2 text-center">
              ⚠️ {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createProject.isPending}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black text-sm sm:text-base font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
