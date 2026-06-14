'use client';

import type { Question } from '@/lib/types';
import { useState, useEffect } from 'react';

interface BuildSentenceProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
}

export default function BuildSentence({
  question,
  onAnswer,
  onContinue,
  disabled = false,
}: BuildSentenceProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  useEffect(() => {
    // Parse the correct answer to get word order
    const words = question.correctAnswer.split(' ');
    setAvailableWords(words.sort(() => Math.random() - 0.5));
  }, [question]);

  const handleSelectWord = (word: string, idx: number) => {
    if (answered || disabled) return;
    
    const newSelected = [...selected, word];
    setSelected(newSelected);
    
    const newAvailable = [...availableWords];
    newAvailable.splice(idx, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (idx: number) => {
    if (answered || disabled) return;
    
    const word = selected[idx];
    setSelected(selected.filter((_, i) => i !== idx));
    setAvailableWords([...availableWords, word].sort());
  };

  const handleSubmit = () => {
    if (selected.length > 0 && !answered) {
      const userAnswer = selected.join(' ');
      const isCorrect = userAnswer === question.correctAnswer;
      setAnswered(true);
      onAnswer(isCorrect, userAnswer);
    }
  };

  const isCorrect = selected.join(' ') === question.correctAnswer;

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

      {/* Answer Area */}
      <div className="p-4 rounded-2xl bg-gray-bg min-h-20 flex flex-wrap gap-2 items-start content-start">
        {selected.length === 0 ? (
          <p className="text-gray-text-s text-sm italic">Tap words below</p>
        ) : (
          selected.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveWord(idx)}
              className={`px-4 py-2 rounded-full font-bold text-white transition-all ${
                answered
                  ? isCorrect
                    ? 'bg-green'
                    : 'bg-red'
                  : 'bg-blue hover:scale-110'
              }`}
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Words */}
      <div className="space-y-3">
        <p className="text-xs text-gray-text-s font-bold">TAP WORDS IN ORDER</p>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectWord(word, idx)}
              disabled={answered || disabled}
              className="px-4 py-2 bg-white border-2 border-gray-border rounded-full font-bold text-gray-text hover:border-blue transition-all disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
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
              <p className="font-black mb-1">Perfect!</p>
              <p>{question.explanation}</p>
            </>
          ) : (
            <>
              <p className="font-black mb-1">Not quite!</p>
              <p>The correct order is: <span className="font-black">{question.correctAnswer}</span></p>
              <p className="mt-2">{question.explanation}</p>
            </>
          )}
        </div>
      )}

      {/* Submit Button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || disabled}
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
