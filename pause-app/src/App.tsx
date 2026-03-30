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

const QUESTIONS = [
  {
    id: 1,
    type: "single" as const,
    text: "When you're stressed, what's your go-to coping mechanism?",
    options: [
      { label: "Order comfort food delivery", value: "food" },
      { label: "Scroll social media", value: "social" },
      { label: "Exercise or go for a walk", value: "exercise" },
      { label: "Call a friend or family member", value: "social-connect" },
    ],
  },
  {
    id: 2,
    type: "single" as const,
    text: "How often do you eat meals at regular times?",
    options: [
      { label: "Almost never — I eat whenever", value: "never" },
      { label: "Sometimes — depends on the day", value: "sometimes" },
      { label: "Usually — I try to stick to a schedule", value: "usually" },
      { label: "Always — I'm very consistent", value: "always" },
    ],
  },
  {
    id: 3,
    type: "single" as const,
    text: "What best describes your relationship with food delivery apps?",
    options: [
      { label: "I order almost daily", value: "daily" },
      { label: "A few times a week", value: "few-weekly" },
      { label: "Once a week or less", value: "weekly" },
      { label: "I rarely use them", value: "rarely" },
    ],
  },
  {
    id: 4,
    type: "multi" as const,
    text: "Which of these do you struggle with? (Select all that apply)",
    options: [
      { label: "Late-night snacking", value: "late-snacking" },
      { label: "Stress eating", value: "stress-eating" },
      { label: "Skipping meals", value: "skipping-meals" },
      { label: "Too much caffeine", value: "caffeine" },
      { label: "Not drinking enough water", value: "hydration" },
      { label: "Emotional eating", value: "emotional" },
    ],
  },
  {
    id: 5,
    type: "slider" as const,
    text: "On a scale of 0-100, how in control do you feel over your eating habits?",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "Not at all",
    sliderMaxLabel: "Completely",
  },
  {
    id: 6,
    type: "single" as const,
    text: "How many hours of sleep do you typically get?",
    options: [
      { label: "Less than 5 hours", value: "under-5" },
      { label: "5-6 hours", value: "5-6" },
      { label: "7-8 hours", value: "7-8" },
      { label: "More than 8 hours", value: "over-8" },
    ],
  },
  {
    id: 7,
    type: "single" as const,
    text: "What time do you usually go to bed?",
    options: [
      { label: "Before 10 PM", value: "before-10" },
      { label: "10 PM - 12 AM", value: "10-12" },
      { label: "12 AM - 2 AM", value: "12-2" },
      { label: "After 2 AM", value: "after-2" },
    ],
  },
  {
    id: 8,
    type: "multi" as const,
    text: "What keeps you up at night? (Select all that apply)",
    options: [
      { label: "Phone/social media", value: "phone" },
      { label: "Work stress", value: "work" },
      { label: "Anxiety or racing thoughts", value: "anxiety" },
      { label: "Netflix/streaming", value: "streaming" },
      { label: "Gaming", value: "gaming" },
    ],
  },
  {
    id: 9,
    type: "slider" as const,
    text: "How would you rate your current energy levels throughout the day?",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "Exhausted",
    sliderMaxLabel: "Energized",
  },
  {
    id: 10,
    type: "single" as const,
    text: "How often do you exercise per week?",
    options: [
      { label: "Never", value: "never" },
      { label: "1-2 times", value: "1-2" },
      { label: "3-4 times", value: "3-4" },
      { label: "5+ times", value: "5-plus" },
    ],
  },
  {
    id: 11,
    type: "single" as const,
    text: "Were you more physically active in the past?",
    options: [
      { label: "Yes, significantly more", value: "much-more" },
      { label: "Somewhat more", value: "somewhat" },
      { label: "About the same", value: "same" },
      { label: "I'm more active now than before", value: "more-now" },
    ],
  },
  {
    id: 12,
    type: "single" as const,
    text: "How much screen time do you average daily (outside of work)?",
    options: [
      { label: "1-2 hours", value: "1-2" },
      { label: "3-4 hours", value: "3-4" },
      { label: "5-6 hours", value: "5-6" },
      { label: "7+ hours", value: "7-plus" },
    ],
  },
  {
    id: 13,
    type: "multi" as const,
    text: "Which apps do you spend the most time on? (Select all that apply)",
    options: [
      { label: "Instagram", value: "instagram" },
      { label: "TikTok", value: "tiktok" },
      { label: "Twitter/X", value: "twitter" },
      { label: "YouTube", value: "youtube" },
      { label: "Food delivery apps", value: "food-apps" },
      { label: "Shopping apps", value: "shopping" },
      { label: "Games", value: "games" },
    ],
  },
  {
    id: 14,
    type: "slider" as const,
    text: "How often do you catch yourself mindlessly opening an app?",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "Rarely",
    sliderMaxLabel: "Constantly",
  },
  {
    id: 15,
    type: "single" as const,
    text: "How would you describe your current work-life balance?",
    options: [
      { label: "Work dominates everything", value: "work-dominant" },
      { label: "Leaning towards work", value: "lean-work" },
      { label: "Fairly balanced", value: "balanced" },
      { label: "I prioritize life over work", value: "life-first" },
    ],
  },
  {
    id: 16,
    type: "single" as const,
    text: "Do you have people in your life who support your health goals?",
    options: [
      { label: "Not really", value: "no" },
      { label: "One or two people", value: "few" },
      { label: "A solid support circle", value: "good" },
      { label: "Yes, very strong support", value: "strong" },
    ],
  },
  {
    id: 17,
    type: "single" as const,
    text: "How do you feel about cooking?",
    options: [
      { label: "I avoid it completely", value: "avoid" },
      { label: "I do it but don't enjoy it", value: "tolerate" },
      { label: "I like it when I have time", value: "like-sometimes" },
      { label: "I genuinely enjoy cooking", value: "enjoy" },
    ],
  },
  {
    id: 18,
    type: "slider" as const,
    text: "How motivated are you to change your current habits?",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "Not motivated",
    sliderMaxLabel: "Extremely motivated",
  },
  {
    id: 19,
    type: "single" as const,
    text: "When you try to build a new habit, what usually happens?",
    options: [
      { label: "I start strong but lose interest in days", value: "days" },
      { label: "I last a few weeks then fall off", value: "weeks" },
      { label: "I'm inconsistent but keep trying", value: "inconsistent" },
      { label: "I usually stick with it", value: "stick" },
    ],
  },
  {
    id: 20,
    type: "single" as const,
    text: "How many glasses of water do you drink daily?",
    options: [
      { label: "0-2 glasses", value: "0-2" },
      { label: "3-4 glasses", value: "3-4" },
      { label: "5-6 glasses", value: "5-6" },
      { label: "7+ glasses", value: "7-plus" },
    ],
  },
  {
    id: 21,
    type: "multi" as const,
    text: "What are your biggest triggers for unhealthy choices? (Select all)",
    options: [
      { label: "Boredom", value: "boredom" },
      { label: "Stress at work", value: "work-stress" },
      { label: "Social pressure", value: "social" },
      { label: "Loneliness", value: "loneliness" },
      { label: "Tiredness", value: "tired" },
      { label: "Seeing ads or notifications", value: "ads" },
    ],
  },
  {
    id: 22,
    type: "single" as const,
    text: "How would you like to be motivated?",
    options: [
      { label: "Tough love — be direct with me", value: "tough" },
      { label: "Data-driven — show me the numbers", value: "data" },
      { label: "Gentle nudge — be kind and supportive", value: "gentle" },
      { label: "A balanced mix", value: "balanced" },
    ],
  },
  {
    id: 23,
    type: "slider" as const,
    text: "How would you rate your overall happiness right now?",
    sliderMin: 0,
    sliderMax: 100,
    sliderMinLabel: "Very unhappy",
    sliderMaxLabel: "Very happy",
  },
  {
    id: 24,
    type: "single" as const,
    text: "What's your primary goal with PAUSE?",
    options: [
      { label: "Eat healthier", value: "eat-healthy" },
      { label: "Reduce screen time", value: "screen-time" },
      { label: "Build better routines", value: "routines" },
      { label: "Feel more in control overall", value: "control" },
    ],
  },
  {
    id: 25,
    type: "text" as const,
    text: "Is there anything else you'd like us to know about you?",
    placeholder: "Share anything that might help us understand you better...",
    skippable: true,
  },
];

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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showInterception, setShowInterception] = useState(false);

  function handleNextQuestion() {
    if (questionIndex + 1 >= QUESTIONS.length) {
      setScreen("reveal");
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  function handleBackQuestion() {
    if (questionIndex === 0) {
      setScreen("safety");
    } else {
      setQuestionIndex((i) => i - 1);
    }
  }

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
          question={QUESTIONS[questionIndex]}
          current={questionIndex + 1}
          total={QUESTIONS.length}
          onNext={handleNextQuestion}
          onBack={handleBackQuestion}
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
        <SettingsPage onTest={() => setShowInterception(true)} />
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
