"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/questions";
import { scoreAnswers } from "@/lib/scoring";
import { getArchetype } from "@/lib/archetypes";
import { createUser, updateUser, getUser } from "@/lib/store";
import { SafetyGateResponse } from "@/lib/types";
import SafetyGate from "@/components/SafetyGate";
import QuestionCard from "@/components/QuestionCard";
import GoalSuggestion from "@/components/GoalSuggestion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Answers = Record<string, string | string[] | number>;

export default function QuestionnairePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"safety" | "questions" | "goals" | "scoring">("safety");
  const [safetyResponse, setSafetyResponse] = useState<SafetyGateResponse | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const handleSafetyGate = useCallback((response: SafetyGateResponse) => {
    setSafetyResponse(response);
    // Create user in localStorage
    const user = getUser() || createUser();
    updateUser({ safety_gate_response: response });
    void user;
    setPhase("questions");
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, value: string | string[] | number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const question = QUESTIONS[currentQ];
  const isAnswered =
    question &&
    (() => {
      const val = answers[question.id];
      if (question.type === "open_text") return true; // open text is optional
      if (question.type === "slider") return val !== undefined;
      if (question.type === "multi_select") return Array.isArray(val) && val.length > 0;
      return typeof val === "string" && val.length > 0;
    })();

  const goNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      // Done with questions, go to goals
      setPhase("goals");
    }
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  const handleGoalsComplete = (goals: string[], userWhy: string) => {
    setPhase("scoring");

    // Separate open text from structured answers
    const openTextIds = ["Q1", "Q2", "Q5", "Q6", "Q10", "Q13", "Q14"];
    const openText: Record<string, string> = {};
    for (const id of openTextIds) {
      if (typeof answers[id] === "string") openText[id] = answers[id] as string;
    }

    const { scores, winner, messagingStyle } = scoreAnswers(answers);
    const archetype = getArchetype(winner);

    updateUser({
      questionnaire_completed: true,
      questionnaire_answers: answers,
      open_text_responses: openText,
      assigned_archetype: winner,
      archetype_scores: scores,
      wellness_baseline: archetype.wellnessBaseline,
      messaging_style: messagingStyle,
      goals,
      user_why: userWhy,
    });

    // Brief loading animation then redirect
    setTimeout(() => {
      router.push("/results");
    }, 2000);
  };

  // Safety Gate phase
  if (phase === "safety") {
    return <SafetyGate onComplete={handleSafetyGate} />;
  }

  // Scoring phase
  if (phase === "scoring") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Loader2 className="w-12 h-12 text-pause-accent animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Building your profile...</h2>
        <p className="text-pause-muted">Analyzing your responses across 10 behavioral dimensions</p>
      </div>
    );
  }

  // Goals phase
  if (phase === "goals") {
    return <GoalSuggestion answers={answers} onComplete={handleGoalsComplete} />;
  }

  // Questions phase
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
  const currentSection = question.sectionTitle;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-pause-darker/90 backdrop-blur-sm border-b border-pause-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-pause-muted">
              {currentQ + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm text-pause-accent font-medium">{currentSection}</span>
          </div>
          <div className="w-full h-1.5 bg-pause-border rounded-full overflow-hidden">
            <div
              className="h-full bg-pause-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <QuestionCard
            question={question}
            value={answers[question.id]}
            onChange={(val) => handleAnswer(question.id, val)}
            sensitive={safetyResponse === "sensitive"}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-pause-darker/90 backdrop-blur-sm border-t border-pause-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentQ === 0}
            className="flex items-center gap-1 px-4 py-2 text-pause-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!isAnswered}
            className="flex items-center gap-1 px-6 py-2.5 bg-pause-accent hover:bg-pause-accent-light text-white font-medium rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {currentQ === QUESTIONS.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
