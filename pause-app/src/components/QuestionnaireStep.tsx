"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

type QuestionType = "single" | "multi" | "slider" | "text";

interface QuestionOption {
  label: string;
  value: string;
}

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
  placeholder?: string;
  skippable?: boolean;
}

interface QuestionnaireStepProps {
  question: Question;
  current: number;
  total: number;
  onNext?: (answer: string | string[] | number) => void;
  onBack?: () => void;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function QuestionnaireStep({
  question,
  current,
  total,
  onNext,
  onBack,
}: QuestionnaireStepProps) {
  const [singleAnswer, setSingleAnswer] = useState<string>("");
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [textValue, setTextValue] = useState("");

  const progress = (current / total) * 100;

  const isAnswered =
    question.type === "single"
      ? singleAnswer !== ""
      : question.type === "multi"
        ? multiAnswers.length > 0
        : question.type === "slider"
          ? true
          : question.skippable || textValue.trim().length > 0;

  function handleNext() {
    if (!onNext) return;
    if (question.type === "single") onNext(singleAnswer);
    else if (question.type === "multi") onNext(multiAnswers);
    else if (question.type === "slider") onNext(sliderValue);
    else onNext(textValue);
  }

  function toggleMulti(value: string) {
    setMultiAnswers((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-pause-bg font-sans">
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-pause-border/50"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-pause-primary" />
        </button>
        <span className="text-sm font-semibold tracking-wide text-pause-primary">
          PAUSE
        </span>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="px-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-pause-muted">
            {current} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-pause-border">
          <motion.div
            className="h-full rounded-full bg-pause-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="flex flex-1 flex-col px-5 pt-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question badge */}
          <span className="inline-flex w-fit rounded-pill bg-pause-accent-light px-3 py-1 text-xs font-bold text-pause-accent">
            Q{current}
          </span>

          {/* Question text */}
          <h2 className="mt-4 text-lg font-bold leading-snug text-pause-primary sm:text-xl">
            {question.text}
          </h2>

          {/* Answer area */}
          <div className="mt-6 flex-1">
            {/* Single choice */}
            {question.type === "single" && question.options && (
              <div className="flex flex-col gap-3">
                {question.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => setSingleAnswer(opt.value)}
                    className={`flex items-center gap-3 rounded-card border-2 p-4 text-left transition-all ${
                      singleAnswer === opt.value
                        ? "border-pause-accent bg-pause-accent-light"
                        : "border-pause-border bg-white hover:border-pause-muted-light"
                    }`}
                    aria-pressed={singleAnswer === opt.value}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        singleAnswer === opt.value
                          ? "bg-pause-accent text-white"
                          : "bg-pause-accent-light text-pause-accent"
                      }`}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="text-base text-pause-primary">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Multi-select */}
            {question.type === "multi" && question.options && (
              <div className="flex flex-col gap-3">
                {question.options.map((opt) => {
                  const checked = multiAnswers.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMulti(opt.value)}
                      className={`flex items-center gap-3 rounded-card border-2 p-4 text-left transition-all ${
                        checked
                          ? "border-pause-accent bg-pause-accent-light"
                          : "border-pause-border bg-white hover:border-pause-muted-light"
                      }`}
                      aria-pressed={checked}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          checked
                            ? "border-pause-accent bg-pause-accent text-white"
                            : "border-pause-border bg-white"
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="text-base text-pause-primary">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Slider */}
            {question.type === "slider" && (
              <div className="mt-4">
                <div className="mb-3 text-center">
                  <span className="inline-flex rounded-pill bg-pause-accent px-4 py-1.5 text-lg font-bold text-white">
                    {sliderValue}
                  </span>
                </div>
                <input
                  type="range"
                  min={question.sliderMin ?? 0}
                  max={question.sliderMax ?? 100}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-pause-accent-light to-pause-accent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pause-accent [&::-webkit-slider-thumb]:shadow-md"
                  aria-label={question.text}
                />
                <div className="mt-2 flex justify-between text-sm text-pause-muted">
                  <span>{question.sliderMinLabel ?? question.sliderMin ?? 0}</span>
                  <span>{question.sliderMaxLabel ?? question.sliderMax ?? 100}</span>
                </div>
              </div>
            )}

            {/* Text */}
            {question.type === "text" && (
              <div>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={question.placeholder ?? "Type your answer..."}
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-card border-2 border-pause-border bg-white p-4 text-base text-pause-primary placeholder-pause-muted-light outline-none transition-colors focus:border-pause-accent"
                  aria-label={question.text}
                />
                <div className="mt-2 flex items-center justify-between">
                  {question.skippable && (
                    <span className="text-sm text-pause-muted-light">
                      (You can skip this one)
                    </span>
                  )}
                  <span className="ml-auto text-xs text-pause-muted-light">
                    {textValue.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="w-full rounded-btn bg-pause-accent py-4 text-base font-semibold text-white shadow-md shadow-pause-accent/15 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pause-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
