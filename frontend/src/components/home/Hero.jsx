import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
    
      <section className="relative z-1 h-[90vh] sm:h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4">
            Empower Your Team with{" "}
            <span className="text-yellow-400">Jeera</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Simplify project management, streamline communication, and track
            progress — all in one intuitive platform inspired by JIRA and
            LinkedIn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
