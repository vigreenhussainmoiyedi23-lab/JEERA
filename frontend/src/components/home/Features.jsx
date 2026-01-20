import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  const GettingStarted = [
    {
      title: "Sign Up",
      desc: "Click Sign Up if u aren't logged in ",
      button: "/login",
    },
    {
      title: "Create Project",
      desc: "Go to Projects page and create your first project.",
    },
    {
      title: "Create your first Task",
      desc: "Tailor dashboards, workflows, and themes to perfectly fit your team’s needs.",
    },
    {
      title: "Analytics Insights",
      desc: "Monitor performance and progress with detailed reports and visual analytics.",
    },
    {
      title: "Cloud Synced",
      desc: "Access your data anywhere, anytime — with real-time syncing across all devices.",
    },
    {
      title: "24/7 Support",
      desc: "Our team is here round the clock to ensure you never face downtime.",
    },
  ];

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"], // scroll progress from 0 → 1 while section is in view
  });

  // Move cards from 0% to -(total width - viewport width)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]); // adjust percentage based on how many cards you want visible

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[220vh] py-24  text-center px-4 md:px-8"
    >
      {/* Horizontal Scroll Container */}
      <div className="sticky top-40 h-[70vh] overflow-hidden z-10">
        {/* Sticky Title */}
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-yellow-400 mb-16 sticky top-[10dvh]  z-20"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Getting Started
        </motion.h2>
        <motion.div
          style={{ x }}
          className="flex gap-6 md:gap-10 items-center h-full px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {GettingStarted.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="flex-shrink-0 w-85 h-75 p-8 rounded-4xl 
                         bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 
                         backdrop-blur-lg shadow-xl hover:shadow-2xl items-start justify-around
                         transition-all duration-300 hover:scale-[1.03] border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-2xl md:text-4xl tracking-tighter whitespace-nowrap  font-bold text-blue-300 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-300  text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
              {feature.button && (
                <Link
                  to={feature.button}
                  className="text-slate-300   bg-blue-300 rounded-4xl px-4 py-2"
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Spacer to allow scrolling */}
      <div className="h-[80vh]" />
    </section>
  );
};

export default GettingStarted;
