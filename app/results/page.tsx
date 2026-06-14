'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { useEffect, useRef, useState } from 'react';
import Confetti from '@/components/Confetti';

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <>{value}</>;
}

export default function ResultsPage() {
  const router = useRouter();
  const { progress, clearLastLessonResult } = useAppStore();
  const lastLessonResult = useAppStore((state) => state.lastLessonResult);

  useEffect(() => {
    if (!lastLessonResult) {
      router.replace('/');
    }
  }, [lastLessonResult, router]);

  const handleContinue = () => {
    clearLastLessonResult();
    router.push('/');
  };

  if (!lastLessonResult) return null;

  const { accuracy, xpGained, correctCount, wrongCount, streakBonus } = lastLessonResult;

  const message =
    accuracy >= 90
      ? { emoji: '🏆', text: 'Perfect! Outstanding!' }
      : accuracy >= 70
        ? { emoji: '🎯', text: 'Great job! Keep it up!' }
        : { emoji: '💪', text: 'Good effort! Practice makes perfect.' };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-purple to-purple-dark flex flex-col items-center justify-center overflow-hidden">
      <Confetti />

      {/* Content */}
      <div className="relative z-10 text-center px-6 w-full max-w-md space-y-6">
        <h1 className="text-4xl font-black text-white">Lesson Complete! 🎊</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <p className="text-white text-xs font-bold mb-1">ACCURACY</p>
            <p className="text-3xl font-black text-gold">
              <CountUp target={accuracy} />%
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <p className="text-white text-xs font-bold mb-1">XP GAINED</p>
            <p className="text-3xl font-black text-yellow-300">
              +<CountUp target={xpGained} duration={1000} />
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <p className="text-white text-xs font-bold mb-1">TOTAL XP</p>
            <p className="text-3xl font-black text-green">
              <CountUp target={progress.totalXP} duration={1400} />
            </p>
          </div>
        </div>

        {/* Correct / Wrong */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <p className="text-white text-xs font-bold mb-1">✅ CORRECT</p>
            <p className="text-3xl font-black text-green">{correctCount}</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <p className="text-white text-xs font-bold mb-1">❌ WRONG</p>
            <p className="text-3xl font-black text-red">{wrongCount}</p>
          </div>
        </div>

        {/* Streak bonus */}
        {streakBonus && (
          <div className="bg-orange/30 border-2 border-orange rounded-2xl p-3 backdrop-blur">
            <p className="text-white font-black text-sm">
              🔥 Streak +1 — {progress.streak} day streak!
            </p>
          </div>
        )}

        {/* Performance message */}
        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
          <p className="text-white font-bold text-lg">
            {message.emoji} {message.text}
          </p>
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gold text-gray-text font-black text-xl rounded-2xl shadow-duolingo hover:scale-105 transition-transform"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}
