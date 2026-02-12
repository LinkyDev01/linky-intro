"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SceneSoundProps {
  onNext: (soundEnabled: boolean) => void;
}

export function SceneSound({ onNext }: SceneSoundProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
      {/* Subtle ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 250,
          height: 250,
          background:
            "radial-gradient(circle, var(--sage) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Sound icon */}
      <motion.div
        className="relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          scale: phase >= 1 ? 1 : 0.8,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <motion.path
            d="M15.54 8.46a5 5 0 0 1 0 7.07"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: phase >= 1 ? 1 : 0,
              opacity: phase >= 1 ? 1 : 0,
            }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.path
            d="M19.07 4.93a10 10 0 0 1 0 14.14"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: phase >= 1 ? 1 : 0,
              opacity: phase >= 1 ? 0.5 : 0,
            }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
        </svg>
      </motion.div>

      {/* Question text */}
      <motion.p
        className="relative z-10 mb-10 font-serif text-lg tracking-wide md:text-xl"
        style={{ color: "var(--light-text)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          y: phase >= 1 ? 0 : 10,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {"소리를 켜시겠어요?"}
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="relative z-10 flex gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: phase >= 2 ? 1 : 0,
          y: phase >= 2 ? 0 : 16,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.button
          onClick={() => onNext(true)}
          className="cursor-pointer rounded-full border px-8 py-3 font-sans text-sm tracking-widest md:text-base"
          style={{
            borderColor: "var(--sage)",
            color: "var(--sage)",
            backgroundColor: "transparent",
          }}
          whileHover={{
            boxShadow: "0 0 24px var(--mint)",
            borderColor: "var(--mint)",
            color: "var(--mint)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {"좋아요"}
        </motion.button>

        <motion.button
          onClick={() => onNext(false)}
          className="cursor-pointer rounded-full border px-8 py-3 font-sans text-sm tracking-widest md:text-base"
          style={{
            borderColor: "var(--light-text)",
            color: "var(--light-text)",
            backgroundColor: "transparent",
            opacity: 0.5,
          }}
          whileHover={{
            opacity: 0.8,
          }}
          whileTap={{ scale: 0.95 }}
        >
          {"괜찮아요"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
