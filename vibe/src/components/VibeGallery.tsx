const vibes = [
  {
    name: "Alex",
    mood: "Happy",
    message: "Sunshine state of mind!",
    gradient: "from-amber-200 to-yellow-300",
    badgeBg: "bg-[var(--color-card-happy)]",
    avatarBg: "from-amber-400 to-orange-400",
    initial: "A",
  },
  {
    name: "Jordan",
    mood: "Chill",
    message: "Just vibing, no worries.",
    gradient: "from-sky-200 to-blue-300",
    badgeBg: "bg-[var(--color-card-chill)]",
    avatarBg: "from-sky-400 to-blue-500",
    initial: "J",
  },
  {
    name: "Sam",
    mood: "Fired Up",
    message: "Let's crush it today!",
    gradient: "from-red-200 to-rose-300",
    badgeBg: "bg-[var(--color-card-fired)]",
    avatarBg: "from-red-400 to-rose-500",
    initial: "S",
  },
  {
    name: "Riley",
    mood: "Dreamy",
    message: "Head in the clouds...",
    gradient: "from-violet-200 to-purple-300",
    badgeBg: "bg-[var(--color-card-dreamy)]",
    avatarBg: "from-violet-400 to-purple-500",
    initial: "R",
  },
  {
    name: "Taylor",
    mood: "Zen",
    message: "Peace and balance.",
    gradient: "from-green-200 to-emerald-300",
    badgeBg: "bg-[var(--color-card-zen)]",
    avatarBg: "from-green-400 to-emerald-500",
    initial: "T",
  },
  {
    name: "Morgan",
    mood: "Bold",
    message: "Fearless and fabulous!",
    gradient: "from-pink-200 to-fuchsia-300",
    badgeBg: "bg-[var(--color-card-bold)]",
    avatarBg: "from-pink-400 to-fuchsia-500",
    initial: "M",
  },
];

export default function VibeGallery() {
  return (
    <section id="vibes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            Explore the Vibes
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            See how others are expressing their mood. Every vibe is unique.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vibes.map((vibe) => (
            <div
              key={vibe.name}
              className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 hover:shadow-lg hover:ring-slate-200 transition-all duration-200 cursor-pointer"
            >
              {/* Card photo area */}
              <div
                className={`aspect-[4/3] w-full rounded-2xl bg-gradient-to-br ${vibe.gradient} flex items-center justify-center`}
              >
                <div
                  className={`h-20 w-20 rounded-full bg-gradient-to-br ${vibe.avatarBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}
                >
                  <span className="text-2xl font-heading font-bold text-white">
                    {vibe.initial}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="mt-4 text-center">
                <h3 className="font-heading text-lg font-semibold text-text">
                  {vibe.name}
                </h3>
                <div
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full ${vibe.badgeBg} px-3 py-1`}
                >
                  <span className="text-sm font-semibold text-text">
                    {vibe.mood}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted">{vibe.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
