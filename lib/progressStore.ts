import fs from 'fs';
import path from 'path';
import type { UserProgress } from '@/lib/types';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'progress.json');

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
  }
}

export function loadAllProgress(): UserProgress[] {
  ensureDataStore();
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw) as UserProgress[];
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    return [];
  }
}

export function saveAllProgress(progressItems: UserProgress[]) {
  ensureDataStore();
  fs.writeFileSync(filePath, JSON.stringify(progressItems, null, 2), 'utf8');
}

export function findProgress(anonymousId: string, language: string) {
  const items = loadAllProgress();
  return items.find((item) => item.userId === anonymousId && item.language === language) ?? null;
}

export function upsertProgress(progress: UserProgress & { anonymousId: string }) {
  const items = loadAllProgress();
  const existingIndex = items.findIndex(
    (item) => item.userId === progress.anonymousId && item.language === progress.language
  );

  const savedProgress: UserProgress = {
    ...progress,
    userId: progress.anonymousId,
    lastActivityDate: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    items[existingIndex] = savedProgress;
  } else {
    items.push(savedProgress);
  }

  saveAllProgress(items);
  return savedProgress;
}
