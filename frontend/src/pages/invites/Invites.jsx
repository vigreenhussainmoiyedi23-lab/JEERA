import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCcw,
  Users,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const Invites = () => {
  const queryClient = useQueryClient();
  const [usersPage, setUsersPage] = useState(1);

  const {
    data: invitesData,
    isLoading: invitesLoading,
    isError: invitesError,
    error: invitesErr,
    refetch: refetchInvites,
    isFetching: invitesFetching,
  } = useQuery({
    queryKey: ["invites"],
    queryFn: async () => (await axiosInstance.get("/user/other/invites")).data,
    staleTime: 1000 * 30,
  });

  const invites = useMemo(() => invitesData?.invites || [], [invitesData]);

  const acceptInviteMutation = useMutation({
    mutationFn: async (projectId) =>
      (await axiosInstance.patch(`/user/other/accept/${projectId}`)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invites"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["projects", "user-projects"] });
    },
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
    refetch: refetchUsers,
    isFetching: usersFetching,
  } = useQuery({
    queryKey: ["users", usersPage],
    queryFn: async () =>
      (
        await axiosInstance.get(
          `/user/other/users?page=${usersPage}&limit=12`,
        )
      ).data,
    staleTime: 1000 * 30,
  });

  const users = useMemo(() => usersData?.users || [], [usersData]);
  const totalPages = usersData?.totalPages || 1;

  return (
    <>
      <Navbar />

      <div className="min-h-screen w-full relative text-white overflow-x-hidden">
        <div className="fixed top-0 z-0 inset-0 bg-slate-950" />
        <div className="fixed top-0 z-0 inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
        <div className="fixed top-0 z-0 inset-0 pointer-events-none">
          <div className="absolute -top-36 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute top-28 left-1/2 h-88 w-176 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] opacity-20" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Invites
              </h1>
              <p className="mt-1 text-sm text-gray-200/70">
                Manage project invitations and discover people to collaborate
                with.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  refetchInvites();
                  refetchUsers();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/5 px-4 py-2 text-sm text-gray-200/80 transition"
              >
                <RefreshCcw
                  className={
                    "h-4 w-4 " +
                    (invitesFetching || usersFetching ? "animate-spin" : "")
                  }
                />
                Refresh
              </button>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_12px_35px_rgba(250,204,21,0.22)] hover:brightness-105 transition"
              >
                <Mail className="h-4 w-4" />
                View Projects
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Invites list */}
            <section className="min-w-0">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Pending invitations
                      </div>
                      <div className="text-xs text-gray-200/70">
                        Accept to join projects instantly.
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-200/80 bg-black/25 border border-white/10 px-2.5 py-1 rounded-full">
                      {invites.length}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {invitesLoading && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-gray-200/75">
                      Loading invites...
                    </div>
                  )}

                  {invitesError && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                      <p className="text-red-400 font-semibold">
                        Error loading invites
                      </p>
                      <p className="mt-1 text-sm text-gray-200/70">
                        {invitesErr?.message || "Something went wrong"}
                      </p>
                      <button
                        onClick={() => refetchInvites()}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm text-gray-100 transition"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Try again
                      </button>
                    </div>
                  )}

                  {!invitesLoading && !invitesError && invites.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
                      <p className="text-white font-semibold">
                        No pending invites
                      </p>
                      <p className="mt-2 text-sm text-gray-200/70">
                        When someone invites you to a project, it will appear
                        here.
                      </p>
                      <Link
                        to="/projects"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-sm font-semibold text-white transition"
                      >
                        Browse projects
                      </Link>
                    </div>
                  )}

                  {!invitesLoading && !invitesError && invites.length > 0 && (
                    <div className="space-y-4">
                      {invites.map((project) => {
                        const membersCount =
                          project?.members?.length != null
                            ? project.members.length
                            : 0;

                        return (
                          <div
                            key={project._id}
                            className="rounded-3xl border border-white/10 bg-black/20 hover:bg-white/5 transition overflow-hidden"
                          >
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-base sm:text-lg font-semibold text-white truncate">
                                    {project.title || "Untitled project"}
                                  </div>
                                  <div className="mt-1 text-sm text-gray-200/70 line-clamp-2">
                                    {project.description ||
                                      "No description provided."}
                                  </div>

                                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-200/70">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1">
                                      <Users className="h-4 w-4" />
                                      {membersCount} member{membersCount === 1 ? "" : "s"}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1">
                                      ID: {String(project._id).slice(0, 8)}...
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex flex-col gap-2 items-end">
                                  <button
                                    onClick={() =>
                                      acceptInviteMutation.mutate(project._id)
                                    }
                                    disabled={acceptInviteMutation.isPending}
                                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-400 px-4 py-2 text-xs sm:text-sm font-semibold text-black shadow-[0_12px_35px_rgba(250,204,21,0.22)] hover:brightness-105 transition disabled:opacity-70"
                                  >
                                    <Check className="h-4 w-4" />
                                    {acceptInviteMutation.isPending
                                      ? "Accepting..."
                                      : "Accept"}
                                  </button>

                                  <Link
                                    to={`/project/${project._id}`}
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {Array.isArray(project?.members) && project.members.length > 0 && (
                              <div className="px-5 pb-5">
                                <div className="text-xs font-semibold text-gray-200/70">
                                  Members
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {project.members.slice(0, 6).map((m) => (
                                    <div
                                      key={m?._id || m?.member?._id}
                                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1"
                                    >
                                      <img
                                        src={
                                          m?.member?.profilePic?.url ||
                                          "/user.png"
                                        }
                                        alt="member"
                                        className="h-5 w-5 rounded-full object-cover border border-white/10 bg-black/20"
                                      />
                                      <span className="text-xs text-gray-100">
                                        {m?.member?.username || "User"}
                                      </span>
                                      <span className="text-[11px] text-gray-200/60">
                                        {m?.role || "member"}
                                      </span>
                                    </div>
                                  ))}
                                  {project.members.length > 6 && (
                                    <div className="text-xs text-gray-200/60 px-2 py-1">
                                      +{project.members.length - 6} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* People directory (for admin invite flows) */}
            <aside className="lg:sticky lg:top-20">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <div className="text-sm font-semibold text-white">
                    People directory
                  </div>
                  <div className="mt-1 text-xs text-gray-200/70">
                    Use this list in admin panels to invite users by ID.
                  </div>
                </div>

                <div className="p-5">
                  {usersLoading && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-200/75">
                      Loading users...
                    </div>
                  )}

                  {usersError && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <p className="text-red-400 font-semibold">
                        Error loading users
                      </p>
                      <p className="mt-1 text-sm text-gray-200/70">
                        {usersErr?.message || "Something went wrong"}
                      </p>
                      <button
                        onClick={() => refetchUsers()}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm text-gray-100 transition"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Try again
                      </button>
                    </div>
                  )}

                  {!usersLoading && !usersError && (
                    <div className="space-y-3">
                      {users.map((u) => (
                        <div
                          key={u._id}
                          className="rounded-2xl border border-white/10 bg-black/20 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u?.profilePic?.url || "/user.png"}
                              alt="user"
                              className="h-9 w-9 rounded-full object-cover border border-white/10 bg-black/20"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-white truncate">
                                {u.username || "User"}
                              </div>
                              <div className="text-xs text-gray-200/70 truncate">
                                {u.email || ""}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[11px] text-gray-200/60">
                            ID: {u._id}
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => setUsersPage((p) => Math.max(p - 1, 1))}
                          disabled={usersPage <= 1}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Prev
                        </button>
                        <div className="text-xs text-gray-200/70">
                          Page {usersPage} / {totalPages}
                        </div>
                        <button
                          onClick={() =>
                            setUsersPage((p) => Math.min(p + 1, totalPages))
                          }
                          disabled={usersPage >= totalPages}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 text-[11px] text-gray-200/55 leading-relaxed">
                        This directory is intentionally read-only. Inviting a user
                        to a specific project is done from that projects admin
                        panel.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invites;
