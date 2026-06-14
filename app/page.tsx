'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import type { Curriculum } from '@/lib/types';

const languages = [
  { code: 'english',             name: 'English',   flag: '🇬🇧' },
  { code: 'hebrew',              name: 'עברית',     flag: '🇮🇱' },
  { code: 'portuguese_portugal', name: 'Português', flag: '🇵🇹' },
  { code: 'chinese',             name: '中文',       flag: '🇨🇳' },
  { code: 'french',              name: 'Français',  flag: '🇫🇷' },
  { code: 'german',              name: 'Deutsch',   flag: '🇩🇪' },
  { code: 'spanish',             name: 'Español',   flag: '🇪🇸' },
  { code: 'greek',               name: 'Ελληνικά', flag: '🇬🇷' },
];

export default function Home() {
  const router = useRouter();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage, progress } = useAppStore();

  useEffect(() => {
    const loadCurriculum = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/curriculum/${language}.json`);
        const data = await response.json();
        setCurriculum(data);
      } catch (error) {
        console.error('Failed to load curriculum:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCurriculum();
  }, [language]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-green to-green-dark flex items-center justify-center">
        <div className="text-white text-3xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green via-green-dark to-green-dark flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex justify-between items-center">
        <h1 className="text-3xl font-black text-white">
          Linguify<span className="text-gold">!</span>
        </h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5 text-white font-bold text-sm">
            <span>🔥</span><span>{progress.streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5 text-white font-bold text-sm">
            <span>⚡</span><span>{progress.totalXP}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5 text-white font-bold text-sm">
            <span>💎</span><span>{progress.gems}</span>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="px-6 pb-4">
        <label className="text-white/70 text-xs font-bold mb-2 block tracking-widest">CHOOSE LANGUAGE</label>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                language === lang.code
                  ? 'bg-gold text-gray-text scale-105 shadow-duolingo'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              <div className="text-xl mb-0.5">{lang.flag}</div>
              <div className="text-[10px] leading-tight">{lang.name.substring(0, 3)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Level + XP bar */}
      <div className="px-6 pb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-black text-sm">Level {progress.level}</span>
          <span className="text-white/70 text-xs font-bold">{progress.totalXP % 100} / 100 XP</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5">
          <div
            className="bg-gold h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min((progress.totalXP % 100) + 1, 100)}%` }}
          />
        </div>
      </div>

      {/* Units */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {curriculum?.units?.map((unit) => (
          <div key={unit.id}>
            <h3 className="text-white font-bold text-base mb-2">
              {unit.emoji} {unit.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {unit.lessons?.map((lesson, idx) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isActive =
                  idx === 0 ||
                  progress.completedLessons.includes(unit.lessons![idx - 1].id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => isActive && router.push(`/lesson/${lesson.id}`)}
                    disabled={!isActive}
                    className={`aspect-square rounded-2xl font-black flex flex-col items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green text-white shadow-duolingo hover:scale-105'
                        : isActive
                          ? 'bg-gold text-gray-text shadow-duolingo hover:scale-105 animate-pulse'
                          : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                    }`}
                  >
                    <span className="text-2xl mb-1">{isCompleted ? '✓' : idx + 1}</span>
                    <span className="text-xs text-center px-1 leading-tight">{lesson.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
