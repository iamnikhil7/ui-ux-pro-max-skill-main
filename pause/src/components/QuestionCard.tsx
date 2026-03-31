"use client";

import { Question } from "@/lib/types";
import { useState, useEffect } from "react";

interface Props {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
  sensitive: boolean;
}

export default function QuestionCard({ question, value, onChange, sensitive }: Props) {
  const [sliderVal, setSliderVal] = useState<number>(
    typeof value === "number" ? value : 50
  );

  useEffect(() => {
    if (question.type === "slider" && typeof value === "number") {
      setSliderVal(value);
    } else if (question.type === "slider" && value === undefined) {
      setSliderVal(50);
    }
  }, [question.id, question.type, value]);

  return (
    <div>
      {sensitive && question.section === 3 && (
        <p className="text-pause-accent text-sm mb-4 bg-pause-accent/10 px-4 py-2 rounded-lg">
          Remember, there are no wrong answers. Go at your own pace.
        </p>
      )}

      <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-8">
        {question.text}
      </h2>

      {question.type === "open_text" && (
        <div>
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength || 500}
            rows={4}
            className="w-full bg-pause-card border border-pause-border rounded-xl px-4 py-3 text-pause-text placeholder:text-pause-muted/50 focus:outline-none focus:border-pause-accent resize-none transition-colors"
          />
          <p className="text-right text-xs text-pause-muted mt-1">
            {typeof value === "string" ? value.length : 0}/{question.maxLength || 500}
          </p>
          <p className="text-sm text-pause-muted mt-1">Optional &mdash; skip if you prefer</p>
        </div>
      )}

      {question.type === "choice" && question.options && (
        <div className="flex flex-col gap-3">
          {question.options.map((opt) => {
            const selected = value === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onChange(opt.key)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                  selected
                    ? "bg-pause-accent/15 border-pause-accent text-white"
                    : "bg-pause-card border-pause-border hover:border-pause-accent/40 text-pause-text"
                }`}
              >
                <span className="font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "multi_select" && question.options && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-pause-muted mb-1">Select all that apply</p>
          {question.options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => {
                  const current = Array.isArray(value) ? [...value] : [];
                  if (selected) {
                    onChange(current.filter((k) => k !== opt.key));
                  } else {
                    onChange([...current, opt.key]);
                  }
                }}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center gap-3 ${
                  selected
                    ? "bg-pause-accent/15 border-pause-accent text-white"
                    : "bg-pause-card border-pause-border hover:border-pause-accent/40 text-pause-text"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? "bg-pause-accent border-pause-accent" : "border-pause-muted"
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "slider" && (
        <div className="mt-4">
          <input
            type="range"
            min={question.sliderMin || 0}
            max={question.sliderMax || 100}
            value={sliderVal}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSliderVal(v);
              onChange(v);
            }}
            className="w-full h-2 bg-pause-border rounded-full appearance-none cursor-pointer accent-pause-accent"
          />
          <div className="flex justify-between mt-3 text-sm text-pause-muted">
            <span>{question.sliderMinLabel || "0"}</span>
            <span className="text-pause-accent font-bold text-lg">{sliderVal}</span>
            <span>{question.sliderMaxLabel || "100"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
