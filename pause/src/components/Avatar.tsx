"use client";

import { getArchetype } from "@/lib/archetypes";
import { ArchetypeKey } from "@/lib/types";

interface Props {
  archetypeKey: ArchetypeKey;
  state?: "resting" | "concerned" | "celebrating";
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ archetypeKey, state = "resting", size = "md" }: Props) {
  const archetype = getArchetype(archetypeKey);
  const sizeMap = { sm: "w-16 h-16", md: "w-24 h-24", lg: "w-36 h-36" };
  const innerSize = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20" };
  const glowSize = { sm: "", md: "shadow-lg", lg: "shadow-xl" };

  const stateStyles = {
    resting: "opacity-80",
    concerned: "opacity-60 scale-95",
    celebrating: "opacity-100 scale-105 animate-pulse",
  };

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center transition-all duration-500 ${stateStyles[state]} ${glowSize[size]}`}
      style={{
        background: `radial-gradient(circle, ${archetype.avatarColor}40, ${archetype.avatarColor}15)`,
        boxShadow: state === "celebrating" ? `0 0 30px ${archetype.avatarColor}50` : undefined,
      }}
    >
      <div
        className={`${innerSize[size]} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: `${archetype.avatarColor}30` }}
      >
        <div
          className="w-3/5 h-3/5 rounded-full"
          style={{ backgroundColor: archetype.avatarColor }}
        />
      </div>
    </div>
  );
}
