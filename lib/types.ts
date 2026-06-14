// Core data types
export type Language = 'english' | 'hebrew' | 'portuguese_portugal' | 'chinese' | 'french' | 'german' | 'spanish' | 'greek';

export type ExerciseType = 'multiple_choice' | 'listen' | 'type' | 'match' | 'build_sentence';

export interface Question {
  id: string;
  type: ExerciseType;
  content: string;
  options?: string[]; // For multiple choice, listen
  correctAnswer: string;
  audioText?: string; // For 'listen' questions: the target-language phrase to speak
  explanation?: string;
  translations?: Record<string, string>;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Lesson {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  questions: Question[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Unit {
  id: string;
  name: string;
  emoji?: string;
  lessons: Lesson[];
  requiredLessonsFromPrevious?: number;
}

export interface Curriculum {
  language: Language;
  units: Unit[];
}

export interface UserProgress {
  userId?: string;
  language: Language;
  completedLessons: string[];
  totalXP: number;
  streak: number;
  gems: number;
  level: number;
  hearts: number;
  maxHearts: number;
  lastActivityDate?: string;
}

export interface LessonState {
  questionIndex: number;
  correctCount: number;
  wrongCount: number;
  hearts: number;
  answered: boolean;
  currentQuestion?: Question;
}

export interface LessonResult {
  lessonId: string;
  correctCount: number;
  wrongCount: number;
  xpGained: number;
  accuracy: number;
  streakBonus: boolean;
}

export interface AppState {
  user: {
    id?: string;
    email?: string;
    name?: string;
  };
  language: Language;
  progress: UserProgress;
  lessonState?: LessonState;
  lastLessonResult?: LessonResult;
  isLoading: boolean;
  error?: string;
}
