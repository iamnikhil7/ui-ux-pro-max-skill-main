import { useState } from "react";
import LandingPage from "./components/LandingPage";
import SafetyGate from "./components/SafetyGate";
import QuestionnaireStep from "./components/QuestionnaireStep";
import ArchetypeReveal from "./components/ArchetypeReveal";
import Dashboard from "./components/Dashboard";
import AnalyticsPage from "./components/AnalyticsPage";
import AvatarBoard from "./components/AvatarBoard";
import InterceptionModal from "./components/InterceptionModal";
import SettingsPage from "./components/SettingsPage";
import DecisionSprint from "./components/DecisionSprint";

type Screen =
  | "landing"
  | "safety"
  | "questionnaire"
  | "reveal"
  | "dashboard"
  | "analytics"
  | "leaderboard"
  | "settings"
  | "sprint";

const SAMPLE_QUESTION = {
  id: 1,
  type: "single" as const,
  text: "When you're stressed, what's your go-to coping mechanism?",
  options: [
    { label: "Order comfort food delivery", value: "food" },
    { label: "Scroll social media", value: "social" },
    { label: "Exercise or go for a walk", value: "exercise" },
    { label: "Call a friend or family member", value: "social-connect" },
  ],
};

const SAMPLE_ARCHETYPE = {
  slug: "burnt-out-professional",
  name: "The Burnt-Out Professional",
  subtitle:
    "High-achiever drowning in deadlines, surviving on delivery apps and caffeine",
  traits: [
    "Late-night snacking",
    "Stress ordering",
    "Caffeine dependent",
    "Skips meals",
    "Desk-bound",
  ],
  wellnessBaseline: 55,
  defaultGoals: [
    "Reduce delivery orders to 2x/week",
    "Walk 20 minutes daily",
    "Drink 8 glasses of water",
    "No screens after 10pm",
  ],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [showInterception, setShowInterception] = useState(false);

  return (
    <div className="min-h-dvh bg-pause-bg font-sans">
      {screen === "landing" && (
        <LandingPage onBegin={() => setScreen("safety")} />
      )}

      {screen === "safety" && (
        <SafetyGate onContinue={() => setScreen("questionnaire")} />
      )}

      {screen === "questionnaire" && (
        <QuestionnaireStep
          question={SAMPLE_QUESTION}
          current={3}
          total={25}
          onNext={() => setScreen("reveal")}
          onBack={() => setScreen("safety")}
        />
      )}

      {screen === "reveal" && (
        <ArchetypeReveal
          archetype={SAMPLE_ARCHETYPE}
          onStart={() => setScreen("dashboard")}
        />
      )}

      {screen === "dashboard" && (
        <Dashboard
          onNavChange={(tab) => {
            if (tab === "analytics") setScreen("analytics");
            if (tab === "leaderboard") setScreen("leaderboard");
            if (tab === "settings") setScreen("settings");
          }}
          onActivity={(id) => {
            if (id === "sprint") setScreen("sprint");
          }}
        />
      )}

      {screen === "analytics" && <AnalyticsPage />}
      {screen === "leaderboard" && <AvatarBoard />}

      {screen === "settings" && (
        <SettingsPage
          onTest={() => setShowInterception(true)}
        />
      )}

      {screen === "sprint" && (
        <DecisionSprint onBackToDashboard={() => setScreen("dashboard")} />
      )}

      <InterceptionModal
        isOpen={showInterception}
        appName="DoorDash"
        message="Before you order — is this hunger or habit?"
        whyText="I want to feel energized, not sluggish. Future me will thank me."
        onPause={() => setShowInterception(false)}
        onContinue={() => setShowInterception(false)}
      />
    </div>
  );
}
