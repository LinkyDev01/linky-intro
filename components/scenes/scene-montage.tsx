"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

interface SceneMontageProps {
  onNext: () => void;
  soundEnabled?: boolean;
}

const fragments = [
  { text: "와인잔 부딪힘", color: "var(--mustard)", x: "15%", y: "20%" },
  { text: "책장 넘김", color: "var(--sage)", x: "70%", y: "15%" },
  { text: "웃음소리", color: "var(--mint)", x: "25%", y: "72%" },
  {
    text: "새벽 집중 테이블",
    color: "var(--rose-brown)",
    x: "65%",
    y: "75%",
  },
  { text: "어색한 첫 눈맞춤", color: "var(--light-text)", x: "50%", y: "45%" },
];

const verses = [
  { text: "어떤 밤은 대화가 흐르고", x: "20%", y: "25%" },
  { text: "어떤 밤은 조용히 깊어진다", x: "50%", y: "35%" },
  { text: "어떤 밤은 처음이 설렌다", x: "30%", y: "60%" },
  {
    text: "어떤 밤은 몰입하다가 시간이 사라진다",
    x: "20%",
    y: "40%",
  },
];

export function SceneMontage({ onNext, soundEnabled = false }: SceneMontageProps) {
  const [phase, setPhase] = useState(0);
  const [pressing, setPressing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ffIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timersRef.current = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 8000),
    ];
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // 꾹 누르면 페이즈 빠르게 진행
  const startFastForward = useCallback(() => {
    setPressing(true);
    // 기존 타이머 취소
    timersRef.current.forEach(clearTimeout);
    // 빠른 간격으로 페이즈 진행
    ffIntervalRef.current = setInterval(() => {
      setPhase((p) => {
        if (p >= 3) {
          if (ffIntervalRef.current) clearInterval(ffIntervalRef.current);
          return 3;
        }
        return p + 1;
      });
    }, 400);
  }, []);

  const stopFastForward = useCallback(() => {
    setPressing(false);
    if (ffIntervalRef.current) {
      clearInterval(ffIntervalRef.current);
      ffIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (ffIntervalRef.current) clearInterval(ffIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!soundEnabled) return;
    const audio = new Audio("/audio/montage.mp3");
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [soundEnabled]);

  return (
    <motion.div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: "var(--dark-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onPointerDown={startFastForward}
      onPointerUp={stopFastForward}
      onPointerLeave={stopFastForward}
      onPointerCancel={stopFastForward}
    >
      {/* Fast-forward indicator */}
      <AnimatePresence>
        {pressing && (
          <motion.div
            className="absolute top-6 left-1/2 z-20 -translate-x-1/2 font-sans text-xs tracking-widest"
            style={{ color: "var(--light-text)", opacity: 0.5 }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {"▶▶"}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Soft blur circles for atmosphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          left: "10%",
          top: "20%",
          background: "radial-gradient(circle, var(--mustard), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0, 0.1, 0.05, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 160,
          height: 160,
          right: "15%",
          top: "30%",
          background: "radial-gradient(circle, var(--sage), transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ opacity: [0, 0.08, 0.04, 0.08] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          left: "40%",
          bottom: "15%",
          background: "radial-gradient(circle, var(--mint), transparent 70%)",
          filter: "blur(55px)",
        }}
        animate={{ opacity: [0, 0.06, 0.12, 0.06] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Fragment keywords */}
      <AnimatePresence>
        {phase >= 1 &&
          fragments.map((frag, i) => (
            <motion.span
              key={`frag-${i}`}
              className="absolute font-sans text-xs tracking-wider md:text-sm"
              style={{
                left: frag.x,
                top: frag.y,
                color: frag.color,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.3, 0.5, 0] }}
              transition={{
                duration: 4,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            >
              {frag.text}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Verse texts */}
      <AnimatePresence>
        {phase >= 2 &&
          verses.map((verse, i) => (
            <motion.p
              key={`verse-${i}`}
              className="absolute max-w-xs font-serif text-sm leading-relaxed tracking-wide md:text-base"
              style={{
                left: verse.x,
                top: verse.y,
                color: "var(--light-text)",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 0.8, 0.6, 0.8, 0] }}
              transition={{
                duration: 4,
                delay: i * 1,
                ease: "easeInOut",
              }}
            >
              {verse.text}
            </motion.p>
          ))}
      </AnimatePresence>

      {/* Continue button */}
      <motion.button
        onClick={onNext}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border px-6 py-2.5 font-sans text-sm tracking-widest transition-shadow duration-300"
        style={{
          borderColor: "var(--sage)",
          color: "var(--sage)",
          backgroundColor: "transparent",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{
          boxShadow: "0 0 20px var(--mint)",
          borderColor: "var(--mint)",
          color: "var(--mint)",
        }}
      >
        {"계속하기"}
      </motion.button>
    </motion.div>
  );
}
