import { ArrowRight } from "lucide-react";

const moods = [
  { emoji: "Happy", color: "bg-[var(--color-card-happy)]", rotation: "-rotate-6" },
  { emoji: "Chill", color: "bg-[var(--color-card-chill)]", rotation: "rotate-3" },
  { emoji: "Fired Up", color: "bg-[var(--color-card-fired)]", rotation: "-rotate-3" },
  { emoji: "Dreamy", color: "bg-[var(--color-card-dreamy)]", rotation: "rotate-6" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cta/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Express yourself
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Show the World{" "}
              <span className="text-primary">Your Vibe</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-text-muted max-w-xl mx-auto lg:mx-0">
              Create a beautiful vibe card with your photo and mood. Share how
              you&apos;re feeling with friends, on social media, or anywhere you
              want to express yourself.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#cta"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cta px-6 text-base font-semibold text-white shadow-lg shadow-cta/25 hover:bg-cta-hover hover:shadow-cta/40 transition-all duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-cta"
              >
                Create Your Vibe
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-6 text-base font-semibold text-text hover:bg-slate-50 transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Right side — vibe card mockup */}
          <div className="flex justify-center lg:justify-end" aria-hidden="true">
            <div className="relative">
              {/* Floating mood tags */}
              {moods.map((mood, i) => (
                <div
                  key={mood.emoji}
                  className={`absolute ${mood.color} ${mood.rotation} rounded-2xl px-4 py-2 text-sm font-heading font-semibold text-text shadow-md`}
                  style={{
                    top: `${15 + i * 22}%`,
                    left: i % 2 === 0 ? "-12%" : "auto",
                    right: i % 2 !== 0 ? "-12%" : "auto",
                  }}
                >
                  {mood.emoji}
                </div>
              ))}

              {/* Main card */}
              <div className="relative w-72 sm:w-80 rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                {/* Photo placeholder */}
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primary/20 via-primary-light/20 to-cta/20 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-white">
                      V
                    </span>
                  </div>
                </div>
                {/* Card info */}
                <div className="mt-5 text-center">
                  <h3 className="font-heading text-lg font-semibold text-text">
                    Your Name
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-card-happy)] px-4 py-1.5">
                    <span className="text-sm font-semibold text-text">
                      Feeling Happy
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-text-muted">
                    Living my best life today!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
