"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Avatar from "./Avatar";
import { ArchetypeKey } from "@/lib/types";

interface Props {
  appName: string;
  message: string;
  userWhy: string | null;
  archetypeKey: ArchetypeKey;
  onPause: () => void;
  onContinue: () => void;
}

export default function InterceptionModal({
  appName,
  message,
  userWhy,
  archetypeKey,
  onPause,
  onContinue,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
        show ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div
        className={`w-full max-w-md bg-pause-darker border border-pause-border rounded-2xl p-8 transition-all duration-500 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <span className="text-sm text-pause-muted font-medium">{appName}</span>
          <button onClick={onContinue} className="text-pause-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <Avatar archetypeKey={archetypeKey} state="concerned" size="md" />
        </div>

        <p className="text-center text-lg font-medium mb-4">{message}</p>

        {userWhy && (
          <p className="text-center text-pause-muted italic mb-6 text-sm">
            &ldquo;{userWhy}&rdquo;
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onPause}
            className="w-full py-3.5 bg-pause-accent hover:bg-pause-accent-light text-white font-semibold rounded-xl transition-all"
          >
            I&apos;ll Pause
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3.5 text-pause-muted hover:text-white transition-colors text-sm"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
