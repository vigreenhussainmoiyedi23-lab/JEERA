import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full relative text-white overflow-x-hidden">
        <div className="fixed top-0 z-0 inset-0 bg-slate-950" />
        <div className="fixed top-0 z-0 inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs sm:text-sm text-gray-200">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="font-medium">About Jeera</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight">
                Built for teams who ship.
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-200/90">
                Jeera blends project execution (Jira-like boards, tasks, and activity) with a
                professional profile layer (LinkedIn-like identity, skills, and connections).
                The goal is simple: help you build, collaborate, and grow — in one place.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-sm text-gray-200/80">Plan</div>
                  <div className="mt-1 text-lg font-semibold">Projects & boards</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-sm text-gray-200/80">Track</div>
                  <div className="mt-1 text-lg font-semibold">Tasks & subtasks</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-sm text-gray-200/80">Connect</div>
                  <div className="mt-1 text-lg font-semibold">Profiles & following</div>
                </div>
              </div>

              <div className="mt-10 text-sm text-gray-200/70">
                Next up: richer Jira features (sprints, epics, filters) and richer profile features
                (experience, messaging, notifications).
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
