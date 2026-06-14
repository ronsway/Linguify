import { NextResponse } from 'next/server';
import { findProgress, upsertProgress } from '@/lib/progressStore';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const anonymousId = url.searchParams.get('anonymousId');
  const language = url.searchParams.get('language');

  if (!anonymousId || !language) {
    return NextResponse.json({ error: 'Missing anonymousId or language' }, { status: 400 });
  }

  const progress = findProgress(anonymousId, language);
  return NextResponse.json({ data: progress ?? null });
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    anonymousId,
    language,
    completedLessons,
    totalXP,
    streak,
    gems,
    level,
    hearts,
    maxHearts,
  } = body;

  if (!anonymousId || !language) {
    return NextResponse.json({ error: 'Missing anonymousId or language' }, { status: 400 });
  }

  const progress = upsertProgress({
    anonymousId,
    language,
    completedLessons,
    totalXP,
    streak,
    gems,
    level,
    hearts,
    maxHearts,
  });

  return NextResponse.json({ data: progress });
}
