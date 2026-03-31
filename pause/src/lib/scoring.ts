import { ArchetypeKey, ArchetypeScores, MessagingStyle } from "./types";

const ARCHETYPE_PRIORITY: ArchetypeKey[] = [
  "burnt_out",
  "former_athlete",
  "overwhelmed_parent",
  "social_butterfly",
  "night_owl",
  "emotional_eater",
  "serial_starter",
  "mindless_grazer",
  "perfectionist_quitter",
  "mindful_aspirant",
];

function initScores(): ArchetypeScores {
  return {
    burnt_out: 0,
    former_athlete: 0,
    overwhelmed_parent: 0,
    social_butterfly: 0,
    night_owl: 0,
    emotional_eater: 0,
    serial_starter: 0,
    mindless_grazer: 0,
    perfectionist_quitter: 0,
    mindful_aspirant: 0,
  };
}

type Answers = Record<string, string | string[] | number>;

// Full scoring map from spec
const CHOICE_SCORING: Record<string, Record<string, ArchetypeKey[]>> = {
  Q3: {
    A: ["former_athlete"],
    B: ["social_butterfly"],
    C: ["night_owl"],
    D: [],
    E: ["mindful_aspirant"],
  },
  Q4: {
    A: ["mindful_aspirant"],
    B: ["perfectionist_quitter", "former_athlete"],
    C: ["social_butterfly"],
    D: ["burnt_out"],
  },
  Q7: {
    A: ["social_butterfly"],
    B: ["burnt_out"],
    C: ["burnt_out", "overwhelmed_parent"],
    D: ["mindless_grazer"],
    E: ["mindful_aspirant"],
  },
  Q9: {
    A: ["mindful_aspirant"],
    B: [],
    C: ["burnt_out"],
    D: ["perfectionist_quitter", "burnt_out"],
  },
  Q12: {
    A: [],
    B: [],
    C: ["night_owl"],
    D: ["burnt_out", "overwhelmed_parent"],
  },
  Q15: {
    A: ["mindless_grazer"],
    B: ["perfectionist_quitter"],
    C: ["social_butterfly"],
    D: ["emotional_eater"],
    E: ["burnt_out", "overwhelmed_parent"],
    F: ["mindful_aspirant"],
  },
  Q16: {
    A: ["burnt_out"],
    B: ["emotional_eater", "burnt_out"],
    C: ["social_butterfly"],
    D: ["serial_starter"],
    E: [],
    F: ["mindful_aspirant"],
  },
  Q17: {
    A: ["perfectionist_quitter"],
    B: ["emotional_eater"],
    C: ["former_athlete"],
    D: ["mindless_grazer"],
    E: ["mindful_aspirant"],
  },
  Q18: {
    A: ["serial_starter"],
    B: ["perfectionist_quitter"],
    C: ["social_butterfly"],
    D: ["overwhelmed_parent"],
    E: ["mindful_aspirant"],
  },
  Q19: {
    A: ["burnt_out"],
    B: ["overwhelmed_parent"],
    C: ["social_butterfly"],
    D: ["night_owl"],
    E: ["mindless_grazer"],
    F: ["mindful_aspirant"],
  },
  Q20: {
    A: ["perfectionist_quitter"],
    B: ["serial_starter"],
    C: ["mindless_grazer"],
    D: ["emotional_eater"],
    E: ["social_butterfly"],
    F: ["mindful_aspirant"],
  },
  Q21: {
    A: ["burnt_out"],
    B: ["mindless_grazer"],
    C: ["social_butterfly"],
    D: ["night_owl"],
    E: ["emotional_eater"],
    F: [],
  },
  Q22: {
    A: ["night_owl"],
    B: [],
    C: ["serial_starter"],
    D: ["perfectionist_quitter"],
    E: ["social_butterfly"],
    F: ["emotional_eater"],
  },
  Q24: {
    A: ["burnt_out", "former_athlete"],
    B: ["perfectionist_quitter"],
    C: ["former_athlete"],
    D: ["emotional_eater"],
    E: ["serial_starter"],
    F: ["mindful_aspirant"],
  },
  Q25: {
    A: ["perfectionist_quitter"],
    B: ["serial_starter"],
    C: ["overwhelmed_parent"],
    D: ["social_butterfly"],
    E: ["serial_starter"],
    F: ["perfectionist_quitter"],
    G: ["mindful_aspirant"],
  },
};

// Q11 multi-select scoring
const Q11_SCORING: Record<string, ArchetypeKey[]> = {
  busier: ["burnt_out"],
  know_but_dont: ["serial_starter"],
  stopped_loving: ["former_athlete", "mindless_grazer"],
  phone_check: ["mindless_grazer", "night_owl"],
  performing: ["perfectionist_quitter", "social_butterfly"],
  night_different: ["night_owl", "emotional_eater"],
};

// Q23 messaging style mapping
const Q23_MESSAGING: Record<string, MessagingStyle> = {
  A: "Data-Driven",
  B: "Gentle Nudge",
  C: "Tough Love",
  D: "Gentle Nudge",
  E: "Balanced",
  F: "Balanced",
};

export function scoreAnswers(answers: Answers): {
  scores: ArchetypeScores;
  winner: ArchetypeKey;
  messagingStyle: MessagingStyle;
} {
  const scores = initScores();

  // Score choice-based questions
  for (const [qId, mapping] of Object.entries(CHOICE_SCORING)) {
    const answer = answers[qId];
    if (typeof answer === "string" && mapping[answer]) {
      for (const arch of mapping[answer]) {
        scores[arch] += 1;
      }
    }
  }

  // Score Q8 slider
  const q8 = answers.Q8;
  if (typeof q8 === "number") {
    if (q8 >= 70) scores.burnt_out += 2;
    else if (q8 >= 50) scores.burnt_out += 1;
    if (q8 < 30) scores.mindful_aspirant += 1;
  }

  // Score Q11 multi-select
  const q11 = answers.Q11;
  if (Array.isArray(q11)) {
    for (const item of q11) {
      const archetypes = Q11_SCORING[item];
      if (archetypes) {
        for (const arch of archetypes) {
          scores[arch] += 1;
        }
      }
    }
  }

  // Determine winner
  let winner: ArchetypeKey = "mindful_aspirant";
  let maxScore = 0;

  for (const key of ARCHETYPE_PRIORITY) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      winner = key;
    }
  }

  // Minimum threshold: must have at least 3
  if (maxScore < 3) {
    winner = "mindful_aspirant";
  }

  // Determine messaging style from Q23
  const q23 = answers.Q23;
  const messagingStyle: MessagingStyle =
    typeof q23 === "string" && Q23_MESSAGING[q23]
      ? Q23_MESSAGING[q23]
      : "Balanced";

  return { scores, winner, messagingStyle };
}
