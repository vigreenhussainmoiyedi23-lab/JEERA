import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import { motion } from "framer-motion";
import Footer from "../../components/home/Footer";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="fixed top-0 z-0 inset-0 bg-slate-950" />
      <div className="fixed top-0 z-0 inset-0 bg-linear-to-b from-slate-950 via-slate-950 to-black" />
      <div className="fixed top-0 z-0 inset-0 pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-28 left-1/2 h-88 w-176 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 h-112 w-240 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[18px_18px] opacity-20" />
      </div>

      {/* 🧱 Main Content */}
      <div className="min-h-screen flex flex-col">
        {/* 🌅 Stunning Hero Section */}
        <Hero />
        <Features />

        {/* 🏢 About Us Section */}
        <section className="relative z-10 flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background Image */}
    
      {/* Content */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative p-8 sm:p-12 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs sm:text-sm text-gray-200">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="font-medium">Built for focused teams</span>
            </div>

            <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight">
              About{" "}
              <span className="bg-linear-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Jeera
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-gray-200/90 max-w-3xl mx-auto">
              Jeera is a next-generation project management platform built to help
              teams plan, track, and deliver impactful work. Inspired by leaders like{" "}
              <span className="font-semibold text-yellow-300">JIRA</span> and{" "}
              <span className="font-semibold text-yellow-300">LinkedIn</span>, Jeera
              blends collaboration, analytics, and design simplicity into one
              seamless experience.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="text-sm text-gray-200/80">Plan</div>
                <div className="mt-1 text-lg font-semibold">Clear projects</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="text-sm text-gray-200/80">Track</div>
                <div className="mt-1 text-lg font-semibold">Task progress</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="text-sm text-gray-200/80">Collaborate</div>
                <div className="mt-1 text-lg font-semibold">Updates & chat</div>
              </div>
            </div>

        {/* Optional Call to Action */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate("/about")}
            className="px-8 py-3.5 bg-yellow-400 text-black font-semibold rounded-xl shadow-[0_12px_30px_rgba(250,204,21,0.16)] hover:bg-yellow-500 transition"
          >
            Learn More
          </button>
        </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Overlay Blur Circles */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
    </section>
    <Footer/>
      </div>

      {/* ⚡ Professional Footer */}
    
    </>
  );
};

export default Home;
