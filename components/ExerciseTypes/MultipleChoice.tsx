'use client';

import type { Question } from '@/lib/types';
import { useState } from 'react';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  question,
  onAnswer,
  onContinue,
  disabled = false,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (!answered && !disabled) {
      setSelected(option);
    }
  };

  const handleSubmit = () => {
    if (selected && !answered) {
      const isCorrect = selected === question.correctAnswer;
      setAnswered(true);
      onAnswer(isCorrect, selected);
    }
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="w-full space-y-6">
      {/* Question Text */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-text mb-2">
          {question.content}
        </h2>
        {question.translations?.en && (
          <p className="text-sm text-gray-text-s">{question.translations.en}</p>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(question.options ?? []).map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={answered || disabled}
            className={`p-4 rounded-2xl font-bold text-lg transition-all ${
              selected === option
                ? answered
                  ? isCorrect
                    ? 'bg-green text-white shadow-duolingo scale-105'
                    : 'bg-red text-white shadow-duolingo scale-105'
                  : 'bg-blue text-white shadow-duolingo scale-105'
                : 'bg-white text-gray-text border-2 border-gray-border hover:border-blue'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{String.fromCharCode(65 + idx)}</span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${
            isCorrect
              ? 'bg-green-light text-green'
              : 'bg-red-light text-red'
          }`}
        >
          {question.explanation}
        </div>
      )}

      {/* Submit Button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!selected || disabled}
          className="w-full py-4 bg-blue text-white font-black text-lg rounded-2xl shadow-duolingo disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          Check
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
