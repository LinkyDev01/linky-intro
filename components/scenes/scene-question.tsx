"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import type { Question, ScoreMap } from "@/lib/linky-types";

interface SceneQuestionProps {
  question: Question;
  questionIndex: number;
  connectionLines: number;
  onAnswer: (scores: ScoreMap, label: string) => void;
}

// Deterministic line positions to avoid hydration mismatch
const LINE_POSITIONS = [
  { y1: 35, y2: 65 },
  { y1: 55, y2: 30 },
  { y1: 70, y2: 45 },
];

export function SceneQuestion({
  question,
  questionIndex,
  connectionLines,
  onAnswer,
}: SceneQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
      onAnswer(question.choices[index].scores, question.choices[index].label);
    }, 800);
  };

  // Background brightness increases per question
  const bgLightness = 0.18 + questionIndex * 0.02;

  const lines = useMemo(
    () => LINE_POSITIONS.slice(0, connectionLines),
    [connectionLines]
  );

  return (
    <motion.div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6"
      style={{
        backgroundColor: `oklch(${bgLightness} 0.04 20)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Connection lines accumulated from answers */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {lines.map((pos, i) => (
          <motion.line
            key={`conn-${i}`}
            x1="0%"
            y1={`${pos.y1}%`}
            x2="100%"
            y2={`${pos.y2}%`}
            stroke="var(--sage)"
            strokeWidth="0.5"
            strokeOpacity={0.15}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Silhouette blur layer for Q2 */}
      {questionIndex === 1 && (
        <motion.div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 120,
            height: 200,
            background:
              "radial-gradient(ellipse, var(--rose-brown), transparent 70%)",
            filter: "blur(40px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5 }}
        />
      )}

      {/* Question text */}
      <motion.h2
        className="relative z-10 mb-10 max-w-md text-center font-serif text-xl leading-relaxed tracking-wide md:text-2xl"
        style={{ color: "var(--light-text)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      >
        {question.text}
      </motion.h2>

      {/* Choice buttons */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const glowColor = choice.color
            ? `var(--${choice.color})`
            : "var(--mint)";

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              className="w-72 cursor-pointer rounded-full border px-6 py-3 font-sans text-sm tracking-wide transition-all duration-300 md:w-80 md:text-base"
              style={{
                borderColor: isSelected ? glowColor : "var(--sage)",
                color: isSelected ? glowColor : "var(--sage)",
                backgroundColor: isSelected
                  ? `color-mix(in oklch, ${glowColor} 10%, transparent)`
                  : "transparent",
                boxShadow: isSelected ? `0 0 20px ${glowColor}` : "none",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.6 + i * 0.15,
              }}
              whileHover={
                selected === null
                  ? {
                      boxShadow: `0 0 20px var(--mint)`,
                      borderColor: "var(--mint)",
                      color: "var(--mint)",
                    }
                  : {}
              }
            >
              {choice.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
