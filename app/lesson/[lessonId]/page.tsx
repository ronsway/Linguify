'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import type { Lesson, Curriculum, ExerciseType } from '@/lib/types';
import { playCorrect, playWrong, playComplete } from '@/lib/sounds';
import MultipleChoice from '@/components/ExerciseTypes/MultipleChoice';
import Listen from '@/components/ExerciseTypes/Listen';
import Type from '@/components/ExerciseTypes/Type';
import Match from '@/components/ExerciseTypes/Match';
import BuildSentence from '@/components/ExerciseTypes/BuildSentence';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const { language, progress, initializeLessonState, recordAnswer, decrementHearts, nextQuestion, endLesson } = useAppStore();
  const lessonState = useAppStore((state) => state.lessonState);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const continuingRef = useRef(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const response = await fetch(`/curriculum/${language}.json`);
        const data: Curriculum = await response.json();

        let foundLesson: Lesson | null = null;
        for (const unit of data.units) {
          const match = unit.lessons?.find((l) => l.id === lessonId);
          if (match) { foundLesson = match; break; }
        }

        if (foundLesson) {
          setLesson(foundLesson);
          initializeLessonState(foundLesson.questions.length);
        }
      } catch (error) {
        console.error('Failed to load lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, lessonId]);

  if (loading || !lesson || !lessonState) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center">
        <div className="text-white text-3xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  const currentQuestion = lesson.questions[lessonState.questionIndex];
  const progressPercent = ((lessonState.questionIndex + 1) / lesson.questions.length) * 100;

  const handleAnswer = (isCorrect: boolean, _selectedAnswer: string) => {
    recordAnswer(isCorrect);
    if (!isCorrect) {
      decrementHearts();
      playWrong();
    } else {
      playCorrect();
    }
  };

  const handleContinue = () => {
    if (continuingRef.current) return;
    continuingRef.current = true;

    if (lessonState.questionIndex + 1 < lesson.questions.length) {
      nextQuestion();
      continuingRef.current = false;
    } else {
      playComplete();
      endLesson(lesson.id);
      router.push('/results');
    }
  };

  const getExerciseComponent = (type: ExerciseType) => {
    const props = {
      question: currentQuestion,
      onAnswer: handleAnswer,
      onContinue: handleContinue,
      disabled: false,
    };
    switch (type) {
      case 'multiple_choice': return <MultipleChoice {...props} />;
      case 'listen':          return <Listen {...(props as any)} />;
      case 'type':            return <Type {...(props as any)} />;
      case 'match':           return <Match {...(props as any)} />;
      case 'build_sentence':  return <BuildSentence {...(props as any)} />;
      default:                return <MultipleChoice {...props} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue via-blue-dark to-blue-dark flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-white text-2xl font-bold hover:scale-110 transition-transform"
        >
          ←
        </button>
        <h1 className="text-white font-black">{lesson.name}</h1>
        <div className="text-white font-bold">
          ❤️ {lessonState.hearts}/{progress.maxHearts}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white text-xs font-bold">
            {lessonState.questionIndex + 1} / {lesson.questions.length}
          </p>
          <p className="text-white text-xs font-bold">
            ⚡ +{lessonState.correctCount * 10} XP
          </p>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="bg-white rounded-3xl p-6 shadow-duolingo">
          {getExerciseComponent(currentQuestion.type)}
        </div>
      </div>
    </div>
  );
}
