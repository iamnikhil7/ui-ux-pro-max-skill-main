"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Download, Upload, Sparkles } from "lucide-react";
import { MOOD_CONFIG, type Mood } from "@/lib/types";

const moods = Object.entries(MOOD_CONFIG) as [Mood, (typeof MOOD_CONFIG)[Mood]][];

export default function CreatePage() {
  const [name, setName] = useState("");
  const [mood, setMood] = useState<Mood>("happy");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const config = MOOD_CONFIG[mood];

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    const { toPng } = await import("html-to-image");
    const url = await toPng(cardRef.current, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibe-card-${name || "my-vibe"}.png`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </a>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold text-text">Create Your Vibe</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Your Photo</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-text-muted"
              >
                {photo ? (
                  <img src={photo} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload a photo</span>
                  </>
                )}
              </button>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
                className="w-full h-11 rounded-xl border border-slate-300 px-4 text-base text-text placeholder:text-text-muted/60 focus:outline-2 focus:outline-primary focus:border-primary transition-colors"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Pick Your Mood</label>
              <div className="grid grid-cols-3 gap-2">
                {moods.map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMood(key)}
                    className={`h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      mood === key
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : "hover:scale-102"
                    }`}
                    style={{ backgroundColor: val.color }}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                Vibe Message <span className="font-normal text-text-muted">({280 - message.length} left)</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                placeholder="What's your vibe today?"
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-text placeholder:text-text-muted/60 focus:outline-2 focus:outline-primary focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full h-12 rounded-full bg-cta text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cta/25 hover:bg-cta-hover transition-colors cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-cta"
            >
              <Download className="h-5 w-5" />
              Download Vibe Card
            </button>
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-text-muted mb-4">Live Preview</p>
            <div
              ref={cardRef}
              className={`w-80 rounded-3xl p-6 shadow-2xl bg-gradient-to-br ${config.gradient}`}
            >
              {/* Photo */}
              <div className="aspect-square w-full rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Your photo" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/60 flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-text/40">
                      {name ? name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-5 text-center">
                <h3 className="font-heading text-xl font-bold text-text">
                  {name || "Your Name"}
                </h3>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm px-4 py-1.5">
                  <span className="text-sm font-bold text-text">
                    {config.label}
                  </span>
                </div>
                {message && (
                  <p className="mt-3 text-sm font-medium text-text/80 leading-relaxed">
                    &ldquo;{message}&rdquo;
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-1 text-text/40">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs font-medium">vibecard.app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
