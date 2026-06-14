'use client';

import type { Question } from '@/lib/types';
import { useState } from 'react';

interface MatchProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
}

export default function Match({
  question,
  onAnswer,
  onContinue,
  disabled = false,
}: MatchProps) {
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [answered, setAnswered] = useState(false);

  // Split options and correct answer to create pairs
  const options = question.options ?? [];
  const pairs = options.slice(0, Math.ceil(options.length / 2));
  const values = options.slice(Math.ceil(options.length / 2));

  const toggleMatch = (pairIdx: number, valueIdx: number) => {
    if (answered || disabled) return;
    
    setMatches((prev) => {
      const newMatches = { ...prev };
      if (newMatches[pairIdx] === valueIdx) {
        delete newMatches[pairIdx];
      } else {
        newMatches[pairIdx] = valueIdx;
      }
      return newMatches;
    });
  };

  const handleSubmit = () => {
    if (Object.keys(matches).length === pairs.length && !answered) {
      // Simple validation - just check if all pairs are matched
      const isCorrect = Object.keys(matches).length === pairs.length;
      setAnswered(true);
      onAnswer(isCorrect, JSON.stringify(matches));
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Question Text */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-text mb-2">
          {question.content}
        </h2>
        <p className="text-sm text-gray-text-s">
          {question.translations?.en || 'Match the pairs'}
        </p>
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Pairs */}
        <div className="space-y-3">
          {pairs.map((pair, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-blue-light text-blue font-bold text-center cursor-pointer hover:scale-105 transition-transform"
            >
              {pair}
            </div>
          ))}
        </div>

        {/* Right Column - Values */}
        <div className="space-y-3">
          {values.map((value, idx) => {
            const isMatched = Object.values(matches).includes(idx);
            return (
              <button
                key={idx}
                onClick={() => {
                  const pairIdx = Object.keys(matches).find(
                    (k) => matches[parseInt(k)] === idx
                  );
                  if (pairIdx !== undefined) {
                    toggleMatch(parseInt(pairIdx), idx);
                  } else if (Object.keys(matches).length < pairs.length) {
                    const firstUnmatched = pairs.findIndex(
                      (_, i) => !(i in matches)
                    );
                    if (firstUnmatched !== -1) {
                      toggleMatch(firstUnmatched, idx);
                    }
                  }
                }}
                disabled={answered || disabled}
                className={`w-full p-4 rounded-2xl font-bold text-center transition-all ${
                  isMatched
                    ? 'bg-green text-white shadow-duolingo'
                    : 'bg-white text-gray-text border-2 border-gray-border hover:border-blue'
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {answered && (
        <div className="p-4 rounded-xl text-sm font-bold bg-green-light text-green">
          <p className="font-black mb-1">Great matching!</p>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Submit Button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(matches).length !== pairs.length || disabled}
          className="w-full py-4 bg-blue text-white font-black text-lg rounded-2xl shadow-duolingo disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          Check {Object.keys(matches).length}/{pairs.length}
        </button>
      )}

      {/* Continue Button */}
      {answered && (
        <button
          onClick={onContinue}
          className="w-full py-4 bg-green text-white font-black text-lg rounded-2xl shadow-duolingo hover:scale-105 transition-transform"
        >
          Continue
        </button>
      )}
    </div>
  );
}
