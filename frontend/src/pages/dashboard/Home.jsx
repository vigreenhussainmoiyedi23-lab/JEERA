import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import { motion } from "framer-motion";
import Footer from "../../components/home/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* Background Image + Overlay */}
      <div
        className="fixed top-0 z-0 inset-0 bg-cover bg-center brightness-75"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80")',
        }}
      ></div>
      <div className="fixed top-0 z-0 inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>

      {/* 🧱 Main Content */}
      <div className="min-h-screen flex flex-col">
        {/* 🌅 Stunning Hero Section */}
        <Hero />
        <Features />

        {/* 🏢 About Us Section */}
        <section className="relative min-h-[100vh] flex items-center justify-center text-center px-6 py-20 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Image */}
    
      {/* Content */}
      <motion.div
        className="relative z-10 bg-transparent max-w-3xl mx-auto text-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
          About <span className="text-yellow-400">Jeera</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl mx-auto">
          Jeera is a next-generation project management platform built to help
          teams plan, track, and deliver impactful work. Inspired by leaders like{" "}
          <span className="font-semibold text-yellow-400">JIRA</span> and{" "}
          <span className="font-semibold text-yellow-400">LinkedIn</span>, Jeera
          blends collaboration, analytics, and design simplicity into one
          seamless experience.
        </p>

        {/* Decorative Divider */}
        <div className="mt-10 flex justify-center">
          <div className="h-1 w-24 bg-yellow-400 rounded-full"></div>
        </div>

        {/* Optional Call to Action */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition">
            Learn More
          </button>
        </motion.div>
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
