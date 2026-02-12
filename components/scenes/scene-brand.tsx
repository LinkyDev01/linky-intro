"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Gathering } from "@/lib/linky-types";

interface SceneBrandProps {
  selectedGathering: Gathering | null;
}

export function SceneBrand({ selectedGathering }: SceneBrandProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "var(--dark-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Animated gradient background glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 500,
          height: 500,
          filter: "blur(120px)",
        }}
        animate={{
          background: [
            "radial-gradient(circle, var(--sage) 0%, transparent 70%)",
            "radial-gradient(circle, var(--mint) 0%, transparent 70%)",
            "radial-gradient(circle, var(--mustard) 0%, transparent 70%)",
            "radial-gradient(circle, var(--sage) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
      />

      {/* Main declaration */}
      <motion.p
        className="relative z-10 mb-2 text-center font-serif text-xl leading-relaxed tracking-wide md:text-2xl"
        style={{ color: "var(--light-text)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          y: phase >= 1 ? 0 : 16,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {"링키는 모임이 아니라"}
      </motion.p>

      <motion.p
        className="relative z-10 mb-8 text-center font-serif text-xl leading-relaxed tracking-wide md:text-2xl"
        style={{ color: "var(--mustard)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          y: phase >= 1 ? 0 : 16,
        }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      >
        {"밤의 방식이다."}
      </motion.p>

      {/* Sub-declaration */}
      <motion.p
        className="relative z-10 mb-12 text-center font-sans text-sm leading-relaxed tracking-wide md:text-base"
        style={{ color: "var(--light-text)", opacity: 0.6 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase >= 2 ? 0.6 : 0,
          y: phase >= 2 ? 0 : 10,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {"그리고 그 밤을 함께 만드는 공간."}
      </motion.p>

      {/* Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: phase >= 3 ? 1 : 0,
          scale: phase >= 3 ? 1 : 0.9,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <span
          className="font-serif text-3xl tracking-[0.3em] pb-1 leading-normal md:text-4xl"
          style={{
            background:
              "linear-gradient(135deg, var(--sage), var(--mint), var(--mustard))",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-shift 4s ease infinite",
          }}
        >
          {"Linky Lounge"}
        </span>
      </motion.div>

      {/* Apply CTA */}
      {selectedGathering && (
        <motion.div
          className="relative z-10 mt-12 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: phase >= 4 ? 1 : 0,
            y: phase >= 4 ? 0 : 20,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p
            className="font-sans text-sm tracking-wide"
            style={{ color: "var(--light-text)", opacity: 0.6 }}
          >
            {`${selectedGathering.name}에 함께 할 준비가 되었다면`}
          </p>
          <motion.a
            href={selectedGathering.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-10 py-3.5 font-sans text-sm tracking-widest transition-shadow duration-300 md:text-base"
            style={{
              backgroundColor: "var(--mint)",
              color: "var(--dark-bg)",
            }}
            whileHover={{
              boxShadow: "0 0 40px var(--mint)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {"신청하기"}
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  );
}
