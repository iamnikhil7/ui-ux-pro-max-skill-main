"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Home, Trophy } from "lucide-react";

interface SprintQuestion {
  id: number;
  left: string;
  right: string;
  correctSide: "left" | "right";
}

const QUESTIONS: SprintQuestion[] = [
  { id: 1, left: "Order pizza delivery", right: "Cook a simple meal at home", correctSide: "right" },
  { id: 2, left: "Scroll social media in bed", right: "Read 10 pages of a book", correctSide: "right" },
  { id: 3, left: "Take the stairs", right: "Take the elevator", correctSide: "left" },
  { id: 4, left: "Drink a soda", right: "Drink water with lemon", correctSide: "right" },
  { id: 5, left: "Go for a 15-min walk", right: "Watch another episode", correctSide: "left" },
  { id: 6, left: "Stress-eat chips", right: "Do 5 minutes of breathing", correctSide: "right" },
  { id: 7, left: "Call a friend", right: "Doomscroll for 30 min", correctSide: "left" },
  { id: 8, left: "Buy coffee again", right: "Brew coffee at home", correctSide: "right" },
  { id: 9, left: "Sleep in and skip gym", right: "Set alarm and work out", correctSide: "right" },
  { id: 10, left: "Meal prep on Sunday", right: "Wing it all week", correctSide: "left" },
];

type GameState = "intro" | "playing" | "result";
type AnswerResult = "correct" | "wrong" | "timeout" | null;

function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const progress = timeLeft / total;
  const offset = circumference * (1 - progress);
  const color = progress > 0.33 ? "#10B981" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s" }}
        />
      </svg>
      <span className="absolute text-lg font-bold text-pause-primary">
        {timeLeft.toFixed(1)}
      </span>
    </div>
  );
}

function ConfettiExplosion() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: -(Math.random() * 300 + 100),
    rotation: Math.random() * 720,
    color: ["#4A90D9", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][
      Math.floor(Math.random() * 5)
    ],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/3"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, borderRadius: 2 }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotation, opacity: 0 }}
          transition={{ duration: 1.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function DecisionSprint({
  onBackToDashboard,
}: {
  onBackToDashboard?: () => void;
}) {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnswerResult>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const TIMER_TOTAL = 3;
  const TOTAL_ROUNDS = QUESTIONS.length;

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || currentResult) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [gameState, timeLeft, currentResult]);

  function handleTimeout() {
    setCurrentResult("timeout");
    setResults((prev) => [...prev, "timeout"]);
    setTimeout(advanceRound, 800);
  }

  function handleAnswer(side: "left" | "right") {
    if (currentResult) return;
    const q = QUESTIONS[round];
    const correct = side === q.correctSide;
    const result: AnswerResult = correct ? "correct" : "wrong";
    setCurrentResult(result);
    if (correct) {
      setScore((s) => s + 1);
      setTotalPoints((p) => p + 3);
    }
    setResults((prev) => [...prev, result]);
    setTimeout(advanceRound, 500);
  }

  function advanceRound() {
    if (round + 1 >= TOTAL_ROUNDS) {
      setGameState("result");
    } else {
      setRound((r) => r + 1);
      setTimeLeft(TIMER_TOTAL);
      setCurrentResult(null);
    }
  }

  function startGame() {
    setGameState("playing");
    setRound(0);
    setTimeLeft(TIMER_TOTAL);
    setScore(0);
    setResults([]);
    setCurrentResult(null);
    setTotalPoints(0);
  }

  const isPerfect = score === TOTAL_ROUNDS;

  // Intro screen
  if (gameState === "intro") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-pause-bg px-6 font-sans">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-pause-accent-light"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <Zap className="h-10 w-10 text-pause-accent" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-bold text-pause-primary">
          Decision Sprint
        </h1>
        <p className="mt-3 max-w-xs text-center text-base text-pause-muted">
          Choose the healthier option in 3 seconds. 10 rounds. Go!
        </p>
        <motion.button
          onClick={startGame}
          className="mt-8 rounded-btn bg-pause-accent px-12 py-4 text-base font-bold text-white shadow-lg shadow-pause-accent/20 hover:brightness-110"
          whileTap={{ scale: 0.97 }}
        >
          Start
        </motion.button>
      </div>
    );
  }

  // Result screen
  if (gameState === "result") {
    const correctCount = results.filter((r) => r === "correct").length;
    const wrongCount = results.filter((r) => r === "wrong").length;
    const timeoutCount = results.filter((r) => r === "timeout").length;
    const bonus = isPerfect ? 5 : 0;
    const finalPoints = totalPoints + bonus;

    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-pause-bg px-6 font-sans">
        {isPerfect && <ConfettiExplosion />}

        {isPerfect && (
          <motion.p
            className="mb-4 text-3xl font-black text-pause-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
            style={{ textShadow: "0 0 20px rgba(74,144,217,0.3)" }}
          >
            PERFECT!
          </motion.p>
        )}

        {/* Score ring */}
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <motion.circle
              cx="70"
              cy="70"
              r="58"
              fill="none"
              stroke="#4A90D9"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 58}
              initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 58 * (1 - score / TOTAL_ROUNDS),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-pause-primary">
              {score}/{TOTAL_ROUNDS}
            </span>
          </div>
        </div>

        <p className="mt-4 text-lg font-bold text-pause-accent">
          {finalPoints} pts
        </p>
        {isPerfect && (
          <p className="text-sm font-medium text-pause-success">
            Perfect Round +5 pts!
          </p>
        )}

        {/* Breakdown */}
        <div className="mt-6 flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-pause-success">{correctCount}</p>
            <p className="text-xs text-pause-muted">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pause-danger">{wrongCount}</p>
            <p className="text-xs text-pause-muted">Wrong</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pause-warning">{timeoutCount}</p>
            <p className="text-xs text-pause-muted">Timeout</p>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <button
            onClick={startGame}
            className="flex items-center justify-center gap-2 rounded-btn bg-pause-accent py-3.5 text-sm font-bold text-white shadow-md hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
          <button
            onClick={onBackToDashboard}
            className="flex items-center justify-center gap-2 rounded-btn border border-pause-border py-3.5 text-sm font-medium text-pause-muted hover:bg-white"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Playing screen
  const q = QUESTIONS[round];

  return (
    <div className="flex min-h-dvh flex-col bg-pause-bg px-5 py-6 font-sans">
      <div className="mx-auto w-full max-w-[480px]">
        {/* Round indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-pause-primary">
            Round {round + 1} of {TOTAL_ROUNDS}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < round
                    ? results[i] === "correct"
                      ? "bg-pause-success"
                      : results[i] === "wrong"
                        ? "bg-pause-danger"
                        : "bg-pause-warning"
                    : i === round
                      ? "bg-pause-accent"
                      : "bg-pause-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="mt-6 flex justify-center">
          <TimerRing timeLeft={timeLeft} total={TIMER_TOTAL} />
        </div>

        {/* Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(["left", "right"] as const).map((side) => {
              const text = side === "left" ? q.left : q.right;
              const isCorrectSide = q.correctSide === side;
              let cardClass = "border-pause-border bg-white hover:border-pause-accent";

              if (currentResult) {
                if (currentResult === "timeout") {
                  cardClass = "border-pause-warning bg-amber-50";
                } else if (isCorrectSide) {
                  cardClass = "border-pause-success bg-green-50";
                } else if (!isCorrectSide && currentResult === "wrong") {
                  cardClass = "border-pause-danger bg-red-50";
                }
              }

              return (
                <motion.button
                  key={side}
                  onClick={() => handleAnswer(side)}
                  disabled={!!currentResult}
                  className={`flex min-h-[140px] flex-col items-center justify-center rounded-card border-2 p-5 text-center transition-all ${cardClass}`}
                  whileTap={currentResult ? {} : { scale: 0.95 }}
                  animate={
                    currentResult === "wrong" && !isCorrectSide
                      ? { x: [0, -8, 8, -4, 4, 0] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium leading-snug text-pause-primary">
                    {text}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Feedback text */}
        <AnimatePresence>
          {currentResult && (
            <motion.p
              className={`mt-4 text-center text-sm font-bold ${
                currentResult === "correct"
                  ? "text-pause-success"
                  : currentResult === "wrong"
                    ? "text-pause-danger"
                    : "text-pause-warning"
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {currentResult === "correct" && "+3 pts"}
              {currentResult === "wrong" && "Not quite!"}
              {currentResult === "timeout" && "Too slow!"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
