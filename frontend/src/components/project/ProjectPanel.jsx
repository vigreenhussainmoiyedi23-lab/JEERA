import React from "react";
import { RefreshCcw, Shield, Users, UserPlus, Ban, UserCheck } from "lucide-react";

const ProjectPanel = ({
  status,
  myCounts,
  statusCards,
  project,
  panelRefresh,
  inviteMemberMutation,
  promoteMutation,
  removeMutation,
  banMutation,
  unbanMutation,
  adminAnalytics,
  analyticsLoading,
  analyticsError,
  analyticsErr,
  analyticsFetching,
  usersData,
  usersLoading,
  usersError,
  usersErr,
  usersFetching,
  refetchUsers,
  myProjectTasks,
}) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Personal Analytics Card */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/50 bg-slate-700/30 px-3 py-1.5 text-xs text-gray-300">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">{status || "member"}</span>
              <span className="text-gray-500">panel</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">
              Your Analytics
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Personal task snapshot for this project
            </p>
          </div>
          <button
            onClick={panelRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 px-3 py-2 text-sm text-gray-300 transition-colors"
          >
            <RefreshCcw
              className={
                "h-4 w-4 " +
                (inviteMemberMutation.isPending ||
                promoteMutation.isPending ||
                removeMutation.isPending ||
                usersFetching
                  ? "animate-spin"
                  : "")
              }
            />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusCards.map((c) => (
            <div
              key={c.key}
              className="bg-slate-700/30 rounded-lg border border-slate-600/30 overflow-hidden"
            >
              <div className={`h-1 bg-linear-to-r ${c.accent}`} />
              <div className="p-3">
                <div className="text-xs font-medium text-gray-400">
                  {c.label}
                </div>
                <div className="mt-1 text-xl font-bold text-white">
                  {c.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Tasks */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Your Tasks
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Tasks assigned to you
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              {myCounts.total}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
            {myProjectTasks.slice(0, 6).map((t) => (
              <div
                key={t._id}
                className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-3"
              >
                <div className="text-sm font-medium text-white truncate">
                  {t.title || "Untitled"}
                </div>
                <div className="mt-1 text-xs text-gray-400 flex items-center justify-between gap-2">
                  <span className="truncate">{t.issueType || "task"}</span>
                  <span className="px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                    {t.taskStatus}
                  </span>
                </div>
              </div>
            ))}
            {myProjectTasks.length === 0 && (
              <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-6 text-center text-sm text-gray-400">
                No tasks assigned to you yet
              </div>
            )}
          </div>
        </div>

        {/* Project Members */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Team Management
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Manage team members and permissions
            </p>
          </div>

          <div className="space-y-4">
            {/* Active Members */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Active Members ({project?.members?.length || 0})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
                {(project?.members || []).map((m) => {
                  const memberId = m?.member?._id;
                  const role = m?.role;
                  const canManage = status === "admin" && role !== "admin";

                  return (
                    <div
                      key={memberId}
                      className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={m?.member?.profilePic?.url || "/user.png"}
                            alt="member"
                            className="h-8 w-8 rounded-full object-cover border border-slate-600/50"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {m?.member?.username || "User"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {m?.member?.email || ""}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-1 bg-slate-600/50 rounded-full text-xs font-medium text-gray-300">
                            {role}
                          </span>

                          {status === "admin" && canManage && (
                            <>
                              {role === "member" ? (
                                <button
                                  onClick={() =>
                                    promoteMutation.mutate({
                                      userid: memberId,
                                      to: "coAdmin",
                                    })
                                  }
                                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/30 transition-colors"
                                >
                                  Promote
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    promoteMutation.mutate({
                                      userid: memberId,
                                      to: "member",
                                    })
                                  }
                                  className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium hover:bg-orange-500/30 transition-colors"
                                >
                                  Demote
                                </button>
                              )}

                              <button
                                onClick={() => banMutation.mutate(memberId)}
                                className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" />
                                Ban
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banned Members */}
            {status === "admin" && (project?.Banned?.length > 0) && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Banned Members ({project?.Banned?.length || 0})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
                  {project?.Banned?.map((bannedUserId) => {
                    // Find user details from usersData or use placeholder
                    const bannedUser = usersData?.users?.find(u => u._id === bannedUserId.toString());
                    
                    return (
                      <div
                        key={bannedUserId}
                        className="bg-red-900/20 rounded-lg border border-red-600/30 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={bannedUser?.profilePic?.url || "/user.png"}
                              alt="banned user"
                              className="h-8 w-8 rounded-full object-cover border border-red-600/50 opacity-75"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-300 truncate">
                                {bannedUser?.username || "Unknown User"}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {bannedUser?.email || ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-medium">
                              Banned
                            </span>
                            <button
                              onClick={() => unbanMutation.mutate(bannedUserId)}
                              className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium hover:bg-green-500/30 transition-colors flex items-center gap-1"
                            >
                              <UserCheck className="w-3 h-3" />
                              Unban
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Analytics */}
      {["admin", "coAdmin"].includes(status) && (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Project Analytics
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Project-wide summary (admin/coAdmin only)
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/30 px-3 py-1.5 text-xs text-gray-300">
              <RefreshCcw className={"h-4 w-4 " + (analyticsFetching ? "animate-spin" : "")} />
              <span>Live</span>
            </div>
          </div>

          <div>
            {analyticsLoading && (
              <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-5 text-sm text-gray-400 text-center">
                Loading analytics...
              </div>
            )}

            {analyticsError && (
              <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-5">
                <div className="text-sm font-medium text-red-400">
                  Failed to load analytics
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {analyticsErr?.message || "Something went wrong"}
                </div>
              </div>
            )}

            {!analyticsLoading && !analyticsError && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                  {Object.entries(adminAnalytics?.statusCounts || {}).map(
                    ([k, v]) => (
                      <div
                        key={k}
                        className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-3"
                      >
                        <div className="text-xs font-medium text-gray-400">
                          {k}
                        </div>
                        <div className="mt-1 text-xl font-bold text-white">
                          {v}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-600/50 flex items-center justify-between">
                    <div className="text-sm font-medium text-white">
                      Per-member Breakdown
                    </div>
                    <div className="text-xs text-gray-400">
                      Assigned task counts
                    </div>
                  </div>

                  <div className="p-4 space-y-2 max-h-64 overflow-y-auto data-lenis-prevent-wheel data-lenis-prevent-touch">
                    {(adminAnalytics?.perMember || []).length === 0 && (
                      <div className="text-sm text-gray-400 text-center py-6">
                        No member analytics yet
                      </div>
                    )}
                    {(adminAnalytics?.perMember || []).slice(0, 12).map((m) => (
                      <div
                        key={m.userId}
                        className="bg-slate-600/30 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={m?.user?.profilePic?.url || "/user.png"}
                              alt="user"
                              className="h-8 w-8 rounded-full object-cover border border-slate-500/50"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {m?.user?.username || "User"}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {m?.user?.email || ""}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex flex-wrap gap-1 justify-end">
                            {Object.entries(m?.counts || {}).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-2 py-1 bg-slate-500/30 rounded text-xs font-medium text-gray-300"
                              >
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Invite Users */}
      {["admin", "coAdmin"].includes(status) && (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Invite Users
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Select users from directory and send invites
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/30 px-3 py-1.5 text-xs text-gray-300">
              <UserPlus className="h-4 w-4" />
              <span>Directory</span>
            </div>
          </div>

          <div>
            {usersLoading && (
              <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-5 text-sm text-gray-400 text-center">
                Loading users...
              </div>
            )}
            {usersError && (
              <div className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-5">
                <div className="text-sm font-medium text-red-400">
                  Failed to load users
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {usersErr?.message || "Something went wrong"}
                </div>
              </div>
            )}

            {!usersLoading && !usersError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(usersData?.users || []).map((u) => (
                  <div
                    key={u._id}
                    className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-3"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={u?.profilePic?.url || "/user.png"}
                        alt="user"
                        className="h-8 w-8 rounded-full object-cover border border-slate-600/50"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">
                          {u.username || "User"}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {u.email || ""}
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const isInvited = project?.invited?.some(id => id.toString() === u._id);
                      const isMember = project?.members?.some(m => m.member?.toString() === u._id);
                      if (isMember) {
                        return (
                          <button
                            disabled
                            className="w-full px-3 py-2 bg-gray-600 text-gray-300 rounded-lg text-xs font-medium cursor-not-allowed opacity-60"
                          >
                            <Users className="h-4 w-4 inline mr-1" />
                            In Project
                          </button>
                        );
                      }
                      if (isInvited) {
                        return (
                          <button
                            disabled
                            className="w-full px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium cursor-not-allowed opacity-60"
                          >
                            <Users className="h-4 w-4 inline mr-1" />
                            Invited
                          </button>
                        );
                      }
                      return (
                        <button
                          onClick={() => inviteMemberMutation.mutate(u._id)}
                          disabled={inviteMemberMutation.isPending}
                          className="w-full px-3 py-2 bg-linear-to-r from-yellow-400 to-amber-500 text-black rounded-lg text-xs font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-70"
                        >
                          <Users className="h-4 w-4 inline mr-1" />
                          Invite
                        </button>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPanel;
