"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Heart, Check } from "lucide-react";

type Selection = "ok" | "sensitive" | null;

interface SafetyGateProps {
  onContinue?: (selection: Selection) => void;
}

export default function SafetyGate({ onContinue }: SafetyGateProps) {
  const [selected, setSelected] = useState<Selection>(null);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-pause-bg to-pause-accent-light font-sans">
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center px-6 py-12">
        {/* Icon */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-pause-accent-light"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShieldCheck className="h-8 w-8 text-pause-accent" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="mt-6 text-2xl font-bold text-pause-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Before we get started
        </motion.h2>

        {/* Info card */}
        <motion.div
          className="mt-6 rounded-card bg-[#F0F4F8] p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-base leading-[1.7] text-pause-muted">
            Some of what we explore together touches on food, body image, and
            health habits. If any of these areas feel sensitive or overwhelming
            for you right now, that's completely okay.
          </p>
          <p className="mt-3 text-base leading-[1.7] text-pause-muted">
            This app is designed to support you, not add pressure.
          </p>
        </motion.div>

        {/* Question */}
        <motion.p
          className="mt-8 text-center text-base font-medium text-pause-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Do any of these areas feel difficult for you right now?
        </motion.p>

        {/* Option cards */}
        <motion.div
          className="mt-5 flex w-full flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Option: I'm good */}
          <button
            onClick={() => setSelected("ok")}
            className={`flex w-full items-center gap-4 rounded-card border-2 p-4 text-left transition-all ${
              selected === "ok"
                ? "border-pause-accent bg-pause-accent-light shadow-sm"
                : "border-pause-border bg-white hover:border-pause-muted-light"
            }`}
            aria-pressed={selected === "ok"}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                selected === "ok"
                  ? "bg-pause-accent text-white"
                  : "bg-pause-accent-light text-pause-accent"
              }`}
            >
              <Check className="h-5 w-5" />
            </div>
            <span className="text-base font-medium text-pause-primary">
              No, I'm good to continue
            </span>
          </button>

          {/* Option: Sensitive */}
          <button
            onClick={() => setSelected("sensitive")}
            className={`flex w-full items-center gap-4 rounded-card border-2 p-4 text-left transition-all ${
              selected === "sensitive"
                ? "border-pause-warning bg-amber-50 shadow-sm"
                : "border-pause-border bg-white hover:border-pause-muted-light"
            }`}
            aria-pressed={selected === "sensitive"}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                selected === "sensitive"
                  ? "bg-pause-warning text-white"
                  : "bg-amber-50 text-pause-warning"
              }`}
            >
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-base font-medium text-pause-primary">
              Yes, some of these feel sensitive
            </span>
          </button>
        </motion.div>

        {/* Continue button */}
        <motion.button
          onClick={() => selected && onContinue?.(selected)}
          disabled={!selected}
          className="mt-8 w-full rounded-btn bg-pause-accent py-4 text-base font-semibold text-white shadow-md shadow-pause-accent/15 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pause-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={selected ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
