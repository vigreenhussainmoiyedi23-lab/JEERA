import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
    
      <section className="relative z-1 h-[90vh] sm:h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 w-full max-w-5xl">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-gray-200 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_0_4px_rgba(250,204,21,0.15)]" />
              <span className="font-medium">Project management + social collaboration</span>
            </div>

            <h2 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
              Empower Your Team with{" "}
              <span className="bg-linear-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">Jeera</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-200/90 max-w-2xl mx-auto leading-relaxed">
              Simplify project management, streamline communication, and track
              progress — all in one intuitive platform inspired by JIRA and
              LinkedIn.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={"/projects"}
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl transition shadow-[0_12px_30px_rgba(250,204,21,0.18)] hover:shadow-[0_14px_34px_rgba(250,204,21,0.24)]"
              >
                Get Started
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4">
                <div className="text-sm text-gray-200/80">Boards & workflows</div>
                <div className="mt-1 text-lg font-semibold">Track work visually</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4">
                <div className="text-sm text-gray-200/80">Collaboration</div>
                <div className="mt-1 text-lg font-semibold">Chat + profiles</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4">
                <div className="text-sm text-gray-200/80">Always in sync</div>
                <div className="mt-1 text-lg font-semibold">Cloud-ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
