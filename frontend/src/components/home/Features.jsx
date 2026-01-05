import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Fast & Secure",
      desc: "Experience blazing-fast performance and top-notch security to keep your projects safe.",
    },
    {
      title: "Easy Collaboration",
      desc: "Work seamlessly with your team in real time, share updates, and stay synced effortlessly.",
    },
    {
      title: "Customizable",
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="min-h-[100vh] flex flex-col justify-center py-20  dark:bg-gray-900 text-center px-6">
      {/* Section Title */}
      <motion.h2
        className="text-3xl sm:text-5xl z-1 font-bold text-gray-900 dark:text-white mb-12"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Key Features
      </motion.h2>

      {/* Features Grid */}
      <motion.div
        className="grid gap-8 sm:grid-cols-2 z-1 lg:grid-cols-3 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="p-8 rounded-xl shadow-lg bg-black/10 backdrop-blur-3xl dark:bg-gray-800 hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
              {f.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
