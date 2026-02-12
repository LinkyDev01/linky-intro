"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BgmPlayerProps {
  soundEnabled?: boolean;
  paused?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
}

export function BgmPlayer({ soundEnabled = false, paused = false, onSoundToggle }: BgmPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/bgm.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    audio.addEventListener("canplaythrough", onCanPlay);

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // soundEnabled와 paused에 따라 재생/정지
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundEnabled && !paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [soundEnabled, paused]);

  const toggle = useCallback(() => {
    onSoundToggle?.(!soundEnabled);
  }, [soundEnabled, onSoundToggle]);

  if (!ready) return null;

  return (
    <motion.button
      onClick={toggle}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(46, 31, 26, 0.6)" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={soundEnabled ? "음악 끄기" : "음악 켜기"}
    >
      <AnimatePresence mode="wait">
        {soundEnabled ? (
          <motion.svg
            key="playing"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {/* Sound wave bars with animation */}
            {[4, 9, 14, 19].map((x, i) => (
              <motion.rect
                key={x}
                x={x}
                width="2"
                rx="1"
                fill="var(--sage)"
                animate={{
                  y: [8, 4, 10, 6, 8],
                  height: [8, 16, 4, 12, 8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.svg>
        ) : (
          <motion.svg
            key="muted"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            {/* Static bars (muted) */}
            {[4, 9, 14, 19].map((x) => (
              <rect
                key={x}
                x={x}
                y={10}
                width="2"
                height="4"
                rx="1"
                fill="var(--light-text)"
                opacity={0.4}
              />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
