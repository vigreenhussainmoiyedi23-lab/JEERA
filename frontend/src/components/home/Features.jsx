// import React, { useRef } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { Link } from "react-router-dom";

// const GettingStarted = () => {
//   const GettingStarted = [
//     {
//       title: "Create Project",
//       desc: "Go to Projects page and create your first project.",
//     },
//     {
//       title: "Create your first Task",
//       desc: "Tailor dashboards, workflows, and themes to perfectly fit your team’s needs.",
//     },
//     {
//       title: "Manage Tasks",
//       desc: "Drag and Drop tasks to update their state.",
//     },
//     {
//       title: "Cloud Synced",
//       desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
//     },
//     {
//       title: "Chat support",
//       desc: "You can chat with anyone anytime Either in project or through their profile.",
//     },
//   ];

//   const sectionRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start start", "end start"], // scroll progress from 0 → 1 while section is in view
//   });

//   // Move cards from 0% to -(total width - viewport width)
//   const x = useTransform(scrollYProgress, [0, 1], [1, 0.75]); // adjust percentage based on how many cards you want visible

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.12, delayChildren: 0.3 },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.7, ease: "easeOut" },
//     },
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative w-full min-h-[220vh] h-full py-24  text-center px-4 md:px-8"
//     >
//       {/* Sticky Title */}
//       <motion.h2
//         className="text-4xl md:text-6xl font-bold text-yellow-400 mb-16 sticky top-[10dvh]  z-20"
//         initial={{ opacity: 0, y: -40 }}
//         whileInView={{ opacity: 1, y: -80 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         Getting Started
//       </motion.h2>

//       {GettingStarted.map((feature, i) => (
//         <motion.div
//           key={i}
//           style={{ scale:x-(i*0.25) }}
//           className={`sticky top-[calc(10vh + ${i*25}px)] w-full  h-screen p-8 rounded-4xl flex items-center justify-center`}
//         >
//           <div className="flex flex-col items-center justify-center w-full max-w-5xl h-75 bg-slate-800 rounded-4xl ">
//             <h3 className="text-2xl md:text-4xl tracking-tighter whitespace-nowrap  font-bold text-blue-300 mb-4 ">
//               {feature.title}
//             </h3>
//             <p className="text-slate-300  text-base leading-relaxed">
//               {feature.desc}
//             </p>
//           </div>
//         </motion.div>
//       ))}
//     </section>
//   );
// };

// export default GettingStarted;
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureCard from "./FeatureCard";

const GettingStarted = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  // const GettingStarted = [
  //   {
  //     title: "Create Project",
  //     desc: "Go to Projects page and create your first project.",
  //     bg: "bg-sky-800",
  //   },
  //   {
  //     title: "Create Your First Task",
  //     desc: "Tailor dashboards, workflows, and themes to perfectly fit your team’s needs.",
  //     bg: "bg-cyan-800",
  //   },
  //   {
  //     title: "Manage Tasks",
  //     desc: "Drag and drop tasks to update their state effortlessly.",
  //     bg: "bg-teal-800",
  //   },
  //   {
  //     title: "Chat Support",
  //     desc: "Chat with anyone anytime — either in a project or through their profile.",
  //     bg: "bg-yellow-800",
  //   },
  //   {
  //     title: "Post Like LinkedIn",
  //     desc: "Post your thougths just like LinkedIn. and a profile sytem like LinkedIn",
  //     bg: "bg-gray-800",
  //   },
  //   {
  //     title: "Cloud Synced",
  //     desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
  //     bg: "bg-slate-800",
  //   },
  // ];
const GettingStarted = [
  {
    title: "Create Project",
    desc: "Go to Projects page and create your first project.",
    bg: "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
    image:"/36.jpg.webp"
  },
  {
    title: "Create Your First Task",
    desc: "Tailor dashboards, workflows, and themes to perfectly fit your team’s needs.",
    bg: "bg-gradient-to-br from-slate-800 via-slate-950 to-black",
    image:"/36.jpg.webp"
  },
  {
    title: "Manage Tasks",
    desc: "Drag and drop tasks to update their state effortlessly.",
    bg: "bg-gradient-to-br from-slate-900 via-black to-black",
    image:"/36.jpg.webp"
  },
  {
    title: "Chat Support",
    desc: "Chat with anyone anytime — either in a project or through their profile.",
    bg: "bg-gradient-to-br from-black via-slate-950 to-black",
    image:"/36.jpg.webp"
  },
  {
    title: "Post Like LinkedIn",
    desc: "Post your thoughts just like LinkedIn, with profiles and feeds.",
    bg: "bg-gradient-to-br from-black via-slate-900 to-black",
    image:"/36.jpg.webp"
  },
  {
    title: "Cloud Synced",
    desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
    bg: "bg-slate-900",
    image:"/36.jpg.webp"
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
        className="sticky top-[18vh] z-20 mx-auto w-fit px-5 py-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-md text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
      >
        Getting Started
        <span className="ml-3 bg-linear-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
          with Jeera
        </span>
      </motion.h2>

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
