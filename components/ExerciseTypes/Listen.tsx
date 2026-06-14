'use client';

import type { Question } from '@/lib/types';
import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/stores/appStore';

// Map app language codes to BCP-47 tags for SpeechSynthesis
const LANG_TAGS: Record<string, string> = {
  english:              'en-US',
  hebrew:               'he-IL',
  portuguese_portugal:  'pt-PT',
  chinese:              'zh-CN',
  french:               'fr-FR',
  german:               'de-DE',
  spanish:              'es-ES',
  greek:                'el-GR',
};

interface ListenProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
}

export default function Listen({
  question,
  onAnswer,
  onContinue,
  disabled = false,
}: ListenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const language = useAppStore((state) => state.language);
  const langTag = LANG_TAGS[language] ?? 'en-US';

  // The phrase to speak: prefer audioText, fall back to correctAnswer
  const phraseToSpeak = question.audioText ?? question.correctAnswer;

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // stop any in-progress speech
    const utt = new SpeechSynthesisUtterance(phraseToSpeak);
    utt.lang = langTag;
    utt.rate = 0.9;
    utt.onstart = () => setIsPlaying(true);
    utt.onend   = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utt);
  }, [phraseToSpeak, langTag]);

  // Auto-play when the question first mounts
  useEffect(() => {
    const timer = setTimeout(speak, 400);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [speak]);

  const handleSelect = (option: string) => {
    if (!answered && !disabled) setSelected(option);
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
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-text mb-2">What do you hear?</h2>
        <p className="text-sm text-gray-text-s">Tap the speaker to listen again</p>
      </div>

      {/* Speaker button */}
      <div className="flex justify-center">
        <button
          onClick={speak}
          disabled={disabled}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-duolingo transition-all ${
            isPlaying
              ? 'bg-blue scale-110 animate-pulse'
              : 'bg-blue hover:scale-110 active:scale-95'
          }`}
        >
          🔊
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
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
            {option}
          </button>
        ))}
      </div>

      {answered && question.explanation && (
        <div className={`p-4 rounded-xl text-sm font-bold ${
          isCorrect ? 'bg-green-light text-green' : 'bg-red-light text-red'
        }`}>
          {isCorrect ? '✅' : '❌'} The phrase was: <strong>{phraseToSpeak}</strong>
          {question.explanation && <p className="mt-1">{question.explanation}</p>}
        </div>
      )}

      {!answered ? (
        <button
          onClick={handleSubmit}
          disabled={!selected || disabled}
          className="w-full py-4 bg-blue text-white font-black text-lg rounded-2xl shadow-duolingo disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          Check
        </button>
      ) : (
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
