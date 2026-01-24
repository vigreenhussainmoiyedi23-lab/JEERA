
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
    <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden w-full">
      {/* 1. Cover Image (Banner) */}
      <div className="h-32 sm:h-44 bg-linear-to-r from-slate-900 via-slate-900 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.14),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[18px_18px] opacity-25" />

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
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-slate-950/60 object-cover bg-slate-800 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Info & Action Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {user.username}
              </h2>
              <span className="text-sm text-gray-400 font-normal"> (He/Him)</span>
            </div>
            
            <p className="text-sm sm:text-base text-gray-200/80 leading-relaxed">
              {user.headline || "Full Stack Developer | React & Node.js Enthusiast"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-200/60 pt-2">
              <span className="flex items-center gap-1"><MapPin size={14}/> Mumbai, India</span>
              <span className="flex items-center gap-1 text-blue-300 font-medium hover:underline cursor-pointer">
                <LinkIcon size={14}/> Contact info
              </span>
            </div>

            <p className="text-blue-300 text-sm font-semibold mt-2 hover:underline cursor-pointer">
              500+ connections
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-full transition-colors">
              Open to
            </button>
            <button className="flex-1 md:flex-none border border-blue-300/60 text-blue-300 hover:bg-blue-400/10 font-semibold px-4 py-1.5 rounded-full transition-colors">
              Add profile section
            </button>
            <button className="p-2 border border-white/10 text-gray-200/70 hover:bg-white/5 rounded-full">
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        {/* 3. Skills/Tags Section (Simulating LinkedIn "Top Skills") */}
        <div className="mt-6 p-4 bg-black/20 rounded-2xl border border-white/10">
          <h3 className="text-sm font-semibold text-gray-200/80 mb-3">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills?.length ? (
              user.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-white/5 text-gray-200/80 px-3 py-1 rounded-full text-sm border border-white/10 hover:border-white/20 transition-colors cursor-default"
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
