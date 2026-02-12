"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { ResultProfile, Gathering } from "@/lib/linky-types";

interface SceneResultProps {
  profile: ResultProfile;
  onNext: (gathering: Gathering) => void;
}

export function SceneResult({ profile, onNext }: SceneResultProps) {
  const [phase, setPhase] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSelect = (gathering: Gathering, index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setTimeout(() => onNext(gathering), 900);
  };

  return (
    <motion.div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6"
      style={{
        backgroundColor: "var(--dark-bg)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Warm ambient glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, var(--mustard), transparent 70%)",
          filter: "blur(100px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.1 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* Top text */}
      <motion.p
        className="relative z-10 mb-4 font-sans text-sm tracking-widest md:text-base"
        style={{ color: "var(--sage)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          y: phase >= 1 ? 0 : 10,
        }}
        transition={{ duration: 0.8 }}
      >
        {"당신에게 어울리는 링키의 밤은"}
      </motion.p>

      {/* Result title */}
      <motion.h1
        className="relative z-10 mb-6 text-center font-serif text-2xl leading-relaxed tracking-wide md:text-3xl"
        style={{ color: "var(--mustard)" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: phase >= 2 ? 1 : 0,
          scale: phase >= 2 ? 1 : 0.95,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {profile.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="relative z-10 mb-10 max-w-sm text-center font-sans text-sm leading-relaxed tracking-wide md:max-w-md md:text-base"
        style={{ color: "var(--light-text)", opacity: 0.8 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase >= 3 ? 0.8 : 0,
          y: phase >= 3 ? 0 : 10,
        }}
        transition={{ duration: 0.8 }}
      >
        {profile.subtitle}
      </motion.p>

      {/* Selectable recommendation cards */}
      <motion.p
        className="relative z-10 mb-4 font-sans text-xs tracking-widest md:text-sm"
        style={{ color: "var(--sage)", opacity: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 0.7 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {"참여하고 싶은 모임을 선택하세요"}
      </motion.p>
      <motion.div
        className="relative z-10 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: phase >= 3 ? 1 : 0,
          y: phase >= 3 ? 0 : 16,
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {profile.recommendations.map((rec, i) => {
          const isSelected = selectedIndex === i;
          const isOther = selectedIndex !== null && selectedIndex !== i;
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(rec, i)}
              className="cursor-pointer rounded-2xl border px-6 py-3.5 font-sans text-sm tracking-wide transition-colors duration-300 md:text-base"
              style={{
                borderColor: isSelected ? "var(--mint)" : "var(--sage)",
                color: isOther ? "var(--rose-brown)" : "var(--light-text)",
                backgroundColor: isSelected
                  ? "oklch(0.22 0.08 170 / 0.4)"
                  : "oklch(0.22 0.05 20 / 0.6)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isOther ? 0.3 : phase >= 3 ? 1 : 0,
                scale: isSelected ? 1.05 : phase >= 3 ? 1 : 0.9,
              }}
              transition={{ duration: 0.5, delay: selectedIndex !== null ? 0 : 0.3 + i * 0.15 }}
              whileHover={
                selectedIndex === null
                  ? { scale: 1.05, borderColor: "var(--mint)" }
                  : {}
              }
            >
              {rec.name}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
