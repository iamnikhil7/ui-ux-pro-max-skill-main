"use client";

import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="text-xl font-heading font-semibold text-text">
              Vibe Card
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#vibes"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Vibes
            </a>
            <a
              href="#cta"
              className="inline-flex h-10 items-center rounded-full bg-cta px-5 text-sm font-semibold text-white shadow-sm hover:bg-cta-hover transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-cta"
            >
              Create Your Vibe
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:text-text hover:bg-slate-100 transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-3">
            <a
              href="#how-it-works"
              className="text-base font-medium text-text-muted hover:text-primary transition-colors duration-200 py-2 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#vibes"
              className="text-base font-medium text-text-muted hover:text-primary transition-colors duration-200 py-2 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              Vibes
            </a>
            <a
              href="#cta"
              className="inline-flex h-11 items-center justify-center rounded-full bg-cta px-5 text-base font-semibold text-white shadow-sm hover:bg-cta-hover transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-cta"
              onClick={() => setMobileOpen(false)}
            >
              Create Your Vibe
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
