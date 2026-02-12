"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SceneEntranceProps {
  onNext: () => void;
}

export function SceneEntrance({ onNext }: SceneEntranceProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 5400),
      setTimeout(() => setPhase(5), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--dark-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Door light slit effect */}
      <motion.div
        className="absolute left-1/2 top-0 h-full -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--mustard) 30%, var(--mustard) 70%, transparent 100%)",
          opacity: 0.15,
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: phase >= 1 ? 3 : 0,
          opacity: phase >= 1 ? 0.2 : 0,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Warm ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, var(--mustard) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.08 : 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* Text lines */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <motion.p
          className="font-serif text-lg leading-relaxed tracking-wide md:text-xl"
          style={{ color: "var(--light-text)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            y: phase >= 2 ? 0 : 12,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {"우리는 보통 혼자 들어온다."}
        </motion.p>

        <motion.p
          className="font-serif text-lg leading-relaxed tracking-wide md:text-xl"
          style={{ color: "var(--light-text)", opacity: 0.7 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase >= 3 ? 0.7 : 0,
            y: phase >= 3 ? 0 : 12,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {"낯선 공간."}
        </motion.p>

        <motion.p
          className="font-serif text-lg leading-relaxed tracking-wide md:text-xl"
          style={{ color: "var(--light-text)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase >= 4 ? 1 : 0,
            y: phase >= 4 ? 0 : 12,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {"하지만 혼자 돌아가진 않는다."}
        </motion.p>
      </div>

      {/* SVG connection line */}
      <motion.svg
        className="absolute left-0 top-[55%] -translate-y-1/2"
        width="100%"
        height="2"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.line
          x1="0"
          y1="1"
          x2="1000"
          y2="1"
          stroke="var(--sage)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: phase >= 5 ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Enter button */}
      <motion.button
        onClick={onNext}
        className="relative z-10 mt-16 cursor-pointer rounded-full border px-8 py-3 font-sans text-sm tracking-widest transition-shadow duration-300 md:text-base"
        style={{
          borderColor: "var(--sage)",
          color: "var(--sage)",
          backgroundColor: "transparent",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: phase >= 5 ? 1 : 0,
          y: phase >= 5 ? 0 : 20,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          boxShadow: "0 0 24px var(--mint)",
          borderColor: "var(--mint)",
          color: "var(--mint)",
        }}
      >
        {"입장하기"}
      </motion.button>
    </motion.div>
  );
}
