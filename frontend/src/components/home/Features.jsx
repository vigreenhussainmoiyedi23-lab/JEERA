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

const GettingStarted = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const opacity=useTransform(scrollYProgress,[0.9,1],[1,0])
  const GettingStarted = [
    {
      title: "Create Project",
      desc: "Go to Projects page and create your first project.",
      bg: "bg-blue-400",
    },
    {
      title: "Create Your First Task",
      desc: "Tailor dashboards, workflows, and themes to perfectly fit your team’s needs.",
      bg: "bg-cyan-400",
    },
    {
      title: "Manage Tasks",
      desc: "Drag and drop tasks to update their state effortlessly.",
      bg: "bg-teal-300",
    },
    {
      title: "Cloud Synced",
      desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
      bg: "bg-lime-300",
    },
    {
      title: "Chat Support",
      desc: "Chat with anyone anytime — either in a project or through their profile.",
      bg: "bg-yellow-300",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[420vh]  text-center px-4 md:px-8"
    >
      {/* Sticky Title */}
      <motion.h2 style={{opacity}} className="text-5xl z-1 md:text-6xl font-bold text-yellow-400  sticky  top-[10vh] ">
        Getting Started
      </motion.h2>

      {/* Cards container */}
      <div className="relative h-[400vh]">
        {GettingStarted.map((feature, i) => {
          const scale = useTransform(
            scrollYProgress,
            [i * 0.15, (i + 1) * 0.15],
            [1, 0.8+(i*0.02)],
          );
          // const opacity = useTransform(scrollYProgress, [i * 0.15, (i + 1) * 0.15], [1, 0.3]);
          const y = useTransform(
            scrollYProgress,
            [i * 0.15, (i + 1) * 0.15],
            [0, -80+(i*20)],
          );

          return (
            <motion.div
              key={i}
              className="sticky top-[15vh] h-[70vh] flex items-center justify-center"
              style={{
                zIndex: i,
                scale,
                // opacity,
              }}
            >
              <motion.div
                style={{ y }}
                className={`${feature.bg} rounded-3xl shadow-2xl relative p-12 min-h-50 w-full max-w-4xl text-center transition-all duration-500`}
              >
                <div className="absolute top-10 left-4 text-5xl text-slate-800 font-extrabold">{i+1}</div>
                <h3 className="text-3xl md:text-5xl text-slate-900 font-extrabold mb-6">
                  {feature.title}
                </h3>
                <p className="text-slate-800 text-lg font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default GettingStarted;
