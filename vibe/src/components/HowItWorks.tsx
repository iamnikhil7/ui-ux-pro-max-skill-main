import { Camera, Palette, Share2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Upload Your Photo",
    description:
      "Choose your favorite selfie or snap a new one. Your photo becomes the heart of your vibe card.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Palette,
    title: "Pick Your Mood",
    description:
      "Feeling happy, chill, fired up, or dreamy? Select a mood and watch your card come alive with color.",
    color: "bg-cta/10 text-cta",
  },
  {
    icon: Share2,
    title: "Share Your Vibe",
    description:
      "Download your vibe card or share it directly to social media. Let the world know how you're feeling.",
    color: "bg-[#7C3AED]/10 text-[#7C3AED]",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-bg-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Three simple steps to create and share your vibe with the world.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-slate-200 transition-all duration-200"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                {i + 1}
              </div>

              {/* Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
              >
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </div>

              <h3 className="mt-5 font-heading text-xl font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
