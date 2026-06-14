import type { Language, UserProgress } from '@/lib/types';

const ANONYMOUS_ID_STORAGE = 'linguify-anonymous-id';

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return 'unknown';

  let anonymousId = window.localStorage.getItem(ANONYMOUS_ID_STORAGE);
  if (!anonymousId) {
    anonymousId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANONYMOUS_ID_STORAGE, anonymousId);
  }

  return anonymousId;
}

export async function loadProgress(anonymousId: string, language: Language) {
  const response = await fetch(`/api/progress?anonymousId=${encodeURIComponent(anonymousId)}&language=${encodeURIComponent(language)}`);
  if (!response.ok) {
    throw new Error('Failed to load progress');
  }

  const payload = await response.json();
  return payload.data as UserProgress | null;
}

export async function saveProgress(progress: UserProgress & { anonymousId: string }) {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress),
  });

  if (!response.ok) {
    throw new Error('Failed to save progress');
  }

  return response.json();
}
