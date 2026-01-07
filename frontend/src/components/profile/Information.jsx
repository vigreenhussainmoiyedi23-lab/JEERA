import React from "react";

const Information = ({ user }) => {
  if (!user)
    return (
      <div className="text-gray-400 text-center py-10 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="bg-black/30 border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">
        {/* Profile Picture */}
        <img
          src={user.profilePic?.url || "/default-avatar.png"}
          alt="profile"
          className="w-28 h-28 rounded-full border-4 border-yellow-400 object-cover shadow-md"
        />

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h2 className="text-3xl font-bold text-yellow-300">{user.username}</h2>
          <p className="text-gray-400">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            {user.skills?.length ? (
              user.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm border border-yellow-300/30"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
