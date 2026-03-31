import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="cta" className="py-20 sm:py-28 bg-bg-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-[#7C3AED] px-6 py-16 sm:px-16 sm:py-24 text-center">
          {/* Decorative shapes */}
          <div className="absolute inset-0 -z-0" aria-hidden="true">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to Vibe?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-md mx-auto">
              Create your first vibe card in seconds. It&apos;s free, fun, and
              totally you.
            </p>
            <div className="mt-8">
              <a
                href="/create"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-white"
              >
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
