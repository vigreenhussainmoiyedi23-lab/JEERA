
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const GettingStarted = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

const GettingStarted = [
  {
    title: "Create Project",
    desc: "Go to Projects page and create your first project.",
    bg: "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
    image: "/gettingStarted/create_project.png"
  },
  {
    title: "Create Your First Task",
    desc: "Tailor dashboards, workflows, and themes to perfectly fit your team's needs.",
    bg: "bg-gradient-to-br from-slate-800 via-slate-950 to-black",
    image: "/gettingStarted/create_task.png"
  },
  {
    title: "Manage Tasks",
    desc: "Drag and drop tasks to update their state effortlessly.",
    bg: "bg-gradient-to-br from-slate-900 via-black to-black",
    image: "/gettingStarted/drag_drop_manage_task.png"
  },
  {
    title: "Chat Support",
    desc: "Chat with anyone anytime — either in a project or through their profile.",
    bg: "bg-gradient-to-br from-black via-slate-950 to-black",
    image: "/gettingStarted/chat_with_project_members.png"
  },
  {
    title: "Post Like LinkedIn",
    desc: "Post your thoughts just like LinkedIn, with profiles and feeds.",
    bg: "bg-gradient-to-br from-black via-slate-900 to-black",
    image: "/gettingStarted/create_post_like_linkedIn.png"
  },
  {
    title: "Cloud Synced",
    desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
    bg: "bg-slate-900 ",
    image: "/gettingStarted/cloud_synced.png",
    imgProperty:"object-contain!"
  },
];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[500vh] h-max text-center"
    >
      {/* Sticky Title */}
      <motion.h2
        style={{ opacity }}
        className="sticky top-[18vh]  z-20 mx-auto w-fit px-5 py-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-md text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
      >
        Getting Started
        <span className="ml-3 bg-linear-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
          with Jeera
        </span>
      </motion.h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/features')}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
      >
        Explore Features
      </motion.button>

      {/* Cards container */}
      <div className="relative h-[600vh]">
        {GettingStarted.map((feature, i) => {
          return <FeatureCard GettingStarted={GettingStarted} i={i} feature={feature} key={i}/>
       })}
      </div>

    </section>
  );
};

export default GettingStarted;
