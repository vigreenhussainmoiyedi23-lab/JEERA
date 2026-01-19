
import { Edit2, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import React from "react";

const Information = ({ user }) => {
  if (!user)
    return (
      <div className="text-gray-400 text-center py-10 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="bg-[#1b1f23] border border-gray-700 rounded-xl overflow-hidden shadow-sm max-w-4xl w-full mx-auto">
      {/* 1. Cover Image (Banner) */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-slate-700 to-slate-900 relative">
        {/* Optional: Add a real banner image here */}
        <div className="absolute top-4 right-4">
           <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <Edit2 size={18} />
           </button>
        </div>
      </div>

      {/* 2. Profile Header Section */}
      <div className="px-6 pb-6 relative">
        {/* Overlapping Profile Picture */}
        <div className="relative -mt-16 sm:-mt-24 mb-4">
          <img
            src={user.profilePic?.url || "/user.png"}
            alt="profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1b1f23] object-cover bg-slate-800"
          />
        </div>

        {/* Info & Action Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-100">
                {user.username}
              </h2>
              <span className="text-sm text-gray-400 font-normal"> (He/Him)</span>
            </div>
            
            <p className="text-lg text-gray-300 leading-tight">
              {user.headline || "Full Stack Developer | React & Node.js Enthusiast"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 pt-2">
              <span className="flex items-center gap-1"><MapPin size={14}/> Mumbai, India</span>
              <span className="flex items-center gap-1 text-blue-400 font-medium hover:underline cursor-pointer">
                <LinkIcon size={14}/> Contact info
              </span>
            </div>

            <p className="text-blue-400 text-sm font-semibold mt-2 hover:underline cursor-pointer">
              500+ connections
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-full transition-colors">
              Open to
            </button>
            <button className="flex-1 md:flex-none border border-blue-400 text-blue-400 hover:bg-blue-400/10 font-semibold px-4 py-1.5 rounded-full transition-colors">
              Add profile section
            </button>
            <button className="p-2 border border-gray-500 text-gray-400 hover:bg-gray-800 rounded-full">
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        {/* 3. Skills/Tags Section (Simulating LinkedIn "Top Skills") */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills?.length ? (
              user.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-transparent text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600 hover:border-gray-400 transition-colors cursor-default"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-xs italic">No skills listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
