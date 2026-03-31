"use client";

import { SafetyGateResponse } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

interface Props {
  onComplete: (response: SafetyGateResponse) => void;
}

export default function SafetyGate({ onComplete }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-pause-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-pause-accent" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Before We Begin</h2>

        <p className="text-pause-muted leading-relaxed text-center mb-10">
          Before we get started &mdash; a quick check. Some of what we explore together
          touches on food, body image, and health habits. If any of these areas feel
          sensitive or overwhelming for you right now, that&apos;s completely okay.
          This app is designed to support you, not add pressure.
        </p>

        <p className="text-center text-pause-text mb-8 font-medium">
          Do any of these areas feel difficult for you right now?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onComplete("ok")}
            className="w-full py-4 bg-pause-card hover:bg-pause-card-hover border border-pause-border hover:border-pause-accent/40 rounded-xl text-left px-6 transition-all"
          >
            <span className="font-medium">No, I&apos;m good to continue</span>
          </button>
          <button
            onClick={() => onComplete("sensitive")}
            className="w-full py-4 bg-pause-card hover:bg-pause-card-hover border border-pause-border hover:border-pause-accent/40 rounded-xl text-left px-6 transition-all"
          >
            <span className="font-medium">Yes, some of these feel sensitive</span>
            <p className="text-sm text-pause-muted mt-1">
              We&apos;ll use gentler language throughout
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
