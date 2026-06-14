'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/stores/appStore';
import { getAnonymousId, loadProgress, saveProgress } from '@/lib/api';

export default function ProgressSync() {
  const language = useAppStore((state) => state.language);
  const progress = useAppStore((state) => state.progress);
  const setProgress = useAppStore((state) => state.setProgress);
  const setError = useAppStore((state) => state.setError);
  const loadedRef = useRef(false);
  const anonymousIdRef = useRef<string>('');

  useEffect(() => {
    anonymousIdRef.current = getAnonymousId();
  }, []);

  useEffect(() => {
    if (!anonymousIdRef.current) return;

    let cancelled = false;
    const load = async () => {
      try {
        const loaded = await loadProgress(anonymousIdRef.current, language);
        if (!cancelled && loaded) {
          setProgress({ ...loaded, language });
        }
      } catch (error) {
        console.error('Failed to load progress', error);
        setError('Unable to load saved progress');
      } finally {
        loadedRef.current = true;
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [language, setError, setProgress]);

  useEffect(() => {
    if (!anonymousIdRef.current || !loadedRef.current) return;

    const save = async () => {
      try {
        await saveProgress({ anonymousId: anonymousIdRef.current, ...progress });
      } catch (error) {
        console.error('Failed to save progress', error);
        setError('Unable to save progress');
      }
    };

    save();
  }, [progress, setError]);

  return null;
}
