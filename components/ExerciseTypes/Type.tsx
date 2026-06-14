'use client';

import type { Question } from '@/lib/types';
import { useState } from 'react';

interface TypeProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
}

export default function Type({
  question,
  onAnswer,
  onContinue,
  disabled = false,
}: TypeProps) {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics

  const handleSubmit = () => {
    if (input && !answered) {
      const isCorrect =
        normalizeText(input) === normalizeText(question.correctAnswer);
      setAnswered(true);
      onAnswer(isCorrect, input);
    }
  };

  const isCorrect =
    answered && normalizeText(input) === normalizeText(question.correctAnswer);

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

      {/* Type Exercise Image/Audio Placeholder */}
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-gray-border rounded-2xl flex items-center justify-center text-4xl">
          🔊
        </div>
      </div>

      {/* Input Field */}
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !answered && input) {
              handleSubmit();
            }
          }}
          disabled={answered || disabled}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-border text-lg font-bold placeholder-gray-text-s disabled:bg-gray-bg"
        />
        <p className="text-xs text-gray-text-s">
          Type the translation of the word above
        </p>
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
          {isCorrect ? (
            <>
              <p className="font-black mb-1">Correct!</p>
              <p>{question.explanation}</p>
            </>
          ) : (
            <>
              <p className="font-black mb-1">Not quite!</p>
              <p>The correct answer is: <span className="font-black">{question.correctAnswer}</span></p>
              <p className="mt-2">{question.explanation}</p>
            </>
          )}
        </div>
      )}

      {/* Submit Button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!input || disabled}
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
