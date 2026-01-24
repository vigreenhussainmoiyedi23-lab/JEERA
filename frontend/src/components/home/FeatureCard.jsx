import { motion, useScroll, useTransform } from "framer-motion";
import {
  Cloud,
  LayoutGrid,
  MessageSquare,
  NotebookPen,
  Share2,
  SquareKanban,
} from "lucide-react";
import React, { useRef } from "react";

const FeatureCard = ({ feature, i, GettingStarted }) => {
  const cardRef = useRef([]);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  const icons = [
    LayoutGrid,
    NotebookPen,
    SquareKanban,
    MessageSquare,
    Share2,
    Cloud,
  ];
  const Icon = icons[i % icons.length];
  return (
    <motion.div
      //   key={i}
      ref={cardRef}
      className={`sticky top-[9vh] ${GettingStarted[i].bg} h-screen w-full overflow-hidden`}
      style={{
        zIndex: i,
        // opacity,
      }}
    >
      <div className="absolute inset-0 z-0 bg-linear-to-b from-white/6 via-transparent to-black/40" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[18px_18px] opacity-25" />
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/20 via-black/35 to-black/60" />

      <div className="absolute top-8 left-5 sm:top-10 sm:left-8 z-20 text-4xl sm:text-5xl text-white/90 font-extrabold tracking-tight">
        0{i + 1}
      </div>

      <div className="absolute inset-0 z-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-5 sm:px-10 lg:px-16">
        <div className={`${i % 2 == 0 ? "order-1" : "order-2"} w-full`}> 
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <motion.h3
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white"
            >
              {feature.title}
            </motion.h3>
            <motion.p
              style={{ opacity }}
              className="mt-4 text-sm sm:text-base md:text-lg font-medium text-white/80 leading-relaxed"
            >
              {feature.desc}
            </motion.p>
          </div>
        </div>

        <div className={`${i % 2 == 0 ? "order-2" : "order-1"} hidden lg:flex justify-center`}> 
          <div className="relative w-full max-w-lg">
            <div className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-yellow-400/10 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center h-12 w-12 rounded-2xl bg-linear-to-br from-yellow-400/20 to-amber-500/10 border border-white/10">
                    <Icon className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Jeera</div>
                    <div className="text-xs text-gray-200/70">Workflow preview</div>
                  </div>
                </div>
                <div className="h-8 w-20 rounded-full bg-white/5 border border-white/10" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-2.5 w-16 rounded-full bg-white/25" />
                  <div className="mt-3 h-2 w-24 rounded-full bg-white/15" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-white/10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-2.5 w-20 rounded-full bg-white/25" />
                  <div className="mt-3 h-2 w-28 rounded-full bg-white/15" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-white/10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-2.5 w-14 rounded-full bg-white/25" />
                  <div className="mt-3 h-2 w-24 rounded-full bg-white/15" />
                  <div className="mt-2 h-2 w-28 rounded-full bg-white/10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-2.5 w-24 rounded-full bg-white/25" />
                  <div className="mt-3 h-2 w-20 rounded-full bg-white/15" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 z-10 ${i % 2 == 0 ? "bg-linear-to-r" : "bg-linear-to-l"} from-black/55 via-black/20 to-transparent`}
      />
    </motion.div>
  );
};

export default FeatureCard;
