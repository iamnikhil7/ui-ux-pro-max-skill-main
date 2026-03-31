"use client";

import { useRouter } from "next/navigation";
import { Pause, Brain, Shield, Zap, Target, BarChart3, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "Behavioral Questionnaire", desc: "Discover your unique behavior profile in just 7 minutes." },
  { icon: Target, title: "10 Unique Archetypes", desc: "Tailored strategies and an avatar that represents your journey." },
  { icon: Shield, title: "Intelligent Interception", desc: "Appears only at critical decision moments, not random notifications." },
  { icon: Zap, title: "Positive Reinforcement", desc: "Every cancelled order is a win. Small victories become lasting change." },
  { icon: BarChart3, title: "Behavior Analytics", desc: "See your habits clearly. Weekly reports reveal your patterns." },
  { icon: Sparkles, title: "Progress Evolution", desc: "Your archetype evolves as you grow. You\u2019re never stuck." },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-pause-accent flex items-center justify-center">
            <Pause className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">PAUSE</h1>
        </div>
        <p className="text-xl text-pause-muted max-w-lg mb-10">
          Your Behavioral Intelligence Layer
        </p>
        <p className="text-pause-muted max-w-2xl mb-12 leading-relaxed">
          Research-backed questions understand who you were, who you are, and who you want to become.
          No judgment. No diets. Just awareness, interception, and lasting change.
        </p>
        <button
          onClick={() => router.push("/questionnaire")}
          className="px-10 py-4 bg-pause-accent hover:bg-pause-accent-light text-white text-lg font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pause-accent/25"
        >
          Begin
        </button>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-pause-card rounded-2xl p-6 border border-pause-border hover:border-pause-accent/30 transition-colors"
            >
              <f.icon className="w-8 h-8 text-pause-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-pause-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-pause-muted text-sm border-t border-pause-border">
        PAUSE &copy; {new Date().getFullYear()} &middot; Your Behavioral Intelligence Layer
      </footer>
    </div>
  );
}
