"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/store";
import { getArchetype } from "@/lib/archetypes";
import { StoredUser } from "@/lib/store";
import Avatar from "@/components/Avatar";
import ProgressRing from "@/components/ProgressRing";
import { ArrowRight } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || !u.questionnaire_completed) {
      router.push("/questionnaire");
      return;
    }
    setUser(u);
  }, [router]);

  if (!user || !user.assigned_archetype) return null;

  const archetype = getArchetype(user.assigned_archetype);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Archetype reveal */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Avatar archetypeKey={user.assigned_archetype} state="celebrating" size="lg" />
          </div>
          <p className="text-pause-accent text-sm font-medium uppercase tracking-wider mb-2">
            Your Archetype
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{archetype.name}</h1>
          <p className="text-pause-muted max-w-lg mx-auto leading-relaxed">
            {archetype.description}
          </p>
        </div>

        {/* Wellness baseline */}
        <div className="flex justify-center mb-10">
          <ProgressRing
            value={archetype.wellnessBaseline}
            color={archetype.avatarColor}
            label="Wellness Baseline"
            size={140}
          />
        </div>

        {/* Traits */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-3">
            Key Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {archetype.traits.map((trait) => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-full text-sm border border-pause-border bg-pause-card"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Goals */}
        {user.goals.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-medium text-pause-muted uppercase tracking-wider mb-3">
              Your Goals
            </h3>
            <div className="flex flex-col gap-2">
              {user.goals.map((goal, i) => (
                <div key={i} className="bg-pause-card border border-pause-border rounded-xl px-5 py-3">
                  <p className="text-sm">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Why */}
        {user.user_why && (
          <div className="mb-10 bg-pause-accent/10 border border-pause-accent/20 rounded-xl p-6">
            <h3 className="text-sm font-medium text-pause-accent uppercase tracking-wider mb-2">
              Your Why
            </h3>
            <p className="italic text-pause-text">&ldquo;{user.user_why}&rdquo;</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 bg-pause-accent hover:bg-pause-accent-light text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Start My Journey
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
