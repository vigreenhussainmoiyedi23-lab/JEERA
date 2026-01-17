import React from "react";

const MemberInfo = ({ project }) => {
  const admin = project.members.find((m) => m.role === "admin");
  const coAdmins = project.members.filter((m) => m.role === "coAdmin");
  const members = project.members.filter((m) => m.role === "member");
  return (
    <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
      {/* Admin Info */}
      <div>
        <h3 className="font-semibold text-yellow-400 mb-1">Admin</h3>
        <p>{admin?.member.username || "Username"}</p>
        <p className="text-xs text-gray-400">
          {admin?.member.email || "admin@email.com"}
        </p>
      </div>

      {/* Members Info */}
      <div>
        <h3 className="font-semibold text-yellow-400 mb-1">Members</h3>
        <div className="flex flex-wrap gap-2">
          {members.length == 0 && <p>No members yet</p>}
          {members.length > 0 &&
            members.map((m, idx) => (
              <span
                key={m._id}
                className="bg-gray-700 px-2 py-1 rounded-md text-sm"
              >
                {m.member.username}
              </span>
            ))}
        </div>
      </div>

      {/* Co-Admins */}
      <div>
        <h3 className="font-semibold text-yellow-400 mb-1">Co-Admins</h3>
        {coAdmins.length == 0 && <p>No members yet</p>}

        {coAdmins.length > 0 &&
          coAdmins.map((a) => <p key={a._id}>{a.member.username}</p>)}
      </div>
    </div>
  );
};

export default MemberInfo;
