import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <Sparkles
              className="h-6 w-6 text-primary"
              aria-hidden="true"
            />
            <span className="text-lg font-heading font-semibold text-text">
              Vibe Card
            </span>
          </a>

          {/* Links */}
          <nav className="flex gap-6" aria-label="Footer navigation">
            <a
              href="#how-it-works"
              className="text-sm text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#vibes"
              className="text-sm text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Vibes
            </a>
            <a
              href="#"
              className="text-sm text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Privacy
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Vibe Card. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
