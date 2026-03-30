"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, User, Smartphone } from "lucide-react";

interface InterceptionModalProps {
  isOpen: boolean;
  appName?: string;
  appIcon?: React.ReactNode;
  message?: string;
  whyText?: string;
  archetypeColor?: string;
  pointsReward?: number;
  onPause?: () => void;
  onContinue?: () => void;
}

function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 300 - 150,
    y: -(Math.random() * 200 + 50),
    rotation: Math.random() * 720 - 360,
    color: ["#4A90D9", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][
      Math.floor(Math.random() * 5)
    ],
    size: Math.random() * 6 + 4,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            rotate: p.rotation,
            opacity: 0,
          }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function InterceptionModal({
  isOpen,
  appName = "DoorDash",
  appIcon,
  message = "Before you order — is this hunger or habit?",
  whyText,
  archetypeColor = "#F59E0B",
  pointsReward = 8,
  onPause,
  onContinue,
}: InterceptionModalProps) {
  const [state, setState] = useState<"prompt" | "celebrated">("prompt");

  function handlePause() {
    setState("celebrated");
    setTimeout(() => {
      onPause?.();
      setState("prompt");
    }, 2000);
  }

  function handleContinue() {
    onContinue?.();
    setState("prompt");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative mx-4 mb-6 w-full max-w-[440px] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:mb-0"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <AnimatePresence mode="wait">
              {state === "prompt" ? (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* App icon */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pause-bg">
                      {appIcon ?? (
                        <Smartphone className="h-6 w-6 text-pause-muted" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-pause-muted">
                      {appName}
                    </span>
                  </div>

                  {/* Message */}
                  <h2 className="mt-5 text-xl font-bold leading-snug text-pause-primary">
                    {message}
                  </h2>

                  {/* Why text */}
                  {whyText && (
                    <div className="mt-4 w-full rounded-card border-l-4 border-pause-accent bg-pause-accent-light/50 p-4 text-left">
                      <p className="text-sm italic text-pause-primary/80">
                        Remember: {whyText}
                      </p>
                    </div>
                  )}

                  {/* Avatar */}
                  <div className="mt-5">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl opacity-70"
                      style={{
                        background: `linear-gradient(135deg, ${archetypeColor}99, ${archetypeColor}55)`,
                      }}
                    >
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex w-full flex-col gap-3">
                    <motion.button
                      onClick={handlePause}
                      className="w-full rounded-btn bg-pause-success py-4 text-base font-bold text-white shadow-md shadow-pause-success/20"
                      animate={{
                        boxShadow: [
                          "0 4px 14px 0 rgba(16,185,129,0.2)",
                          "0 4px 20px 0 rgba(16,185,129,0.35)",
                          "0 4px 14px 0 rgba(16,185,129,0.2)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileTap={{ scale: 0.97 }}
                    >
                      I'll Pause
                    </motion.button>
                    <button
                      onClick={handleContinue}
                      className="w-full rounded-btn border border-pause-border py-4 text-base font-medium text-pause-muted transition-colors hover:bg-pause-bg"
                    >
                      Continue Anyway
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="celebrated"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <Confetti />

                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-pause-success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 200,
                    }}
                  >
                    <Check className="h-10 w-10 text-white" />
                  </motion.div>

                  <motion.span
                    className="mt-4 text-xl font-bold text-pause-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    +{pointsReward} pts
                  </motion.span>

                  <div
                    className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${archetypeColor}, ${archetypeColor}CC)`,
                    }}
                  >
                    <User className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
