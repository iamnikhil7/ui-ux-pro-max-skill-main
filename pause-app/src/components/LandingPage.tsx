"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function FloatingParticles() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.15 + 0.05,
    }))
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-pause-accent"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface LandingPageProps {
  onBegin?: () => void;
}

export default function LandingPage({ onBegin }: LandingPageProps) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-gradient-to-b from-pause-bg to-pause-accent-light font-sans">
      <FloatingParticles />

      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center px-6 py-16 text-center">
        {/* Breathing wordmark */}
        <motion.h1
          className="animate-breathe text-5xl font-bold tracking-tight text-pause-primary sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          PAUSE
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-base font-medium text-pause-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Your Behavioral Intelligence Layer
        </motion.p>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-sm text-base leading-relaxed text-pause-muted-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Understand your patterns. Interrupt your triggers. Become who you want
          to be.
        </motion.p>

        {/* CTA button */}
        <motion.button
          onClick={onBegin}
          className="mt-10 flex items-center gap-2 rounded-btn bg-pause-accent px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-pause-accent/20 transition-all hover:shadow-xl hover:shadow-pause-accent/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pause-accent focus:ring-offset-2 active:scale-[0.98]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Begin
          <ArrowRight className="h-5 w-5" />
        </motion.button>

        {/* Trust signals */}
        <motion.p
          className="mt-8 text-sm text-pause-muted-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          5-7 minutes&ensp;•&ensp;No account needed&ensp;•&ensp;Private by
          design
        </motion.p>
      </div>
    </div>
  );
}
