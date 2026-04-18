'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiError } from '@/types';

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * Generic hook for data fetching with loading / error states.
 *
 * @example
 * const { data, isLoading, error, refetch } = useFetch(() => postsService.getAll());
 */
export function useFetch<T>(fetcher: () => Promise<T>): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync ref after render, never during render
  const fetcherRef = useRef<() => Promise<T>>(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;

    // All setState calls are async (inside the Promise chain) to satisfy
    // the react-hooks/set-state-in-effect rule.
    fetcherRef
      .current()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setIsLoading(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const apiError: ApiError =
          err !== null && typeof err === 'object' && 'status' in err
            ? (err as ApiError)
            : { message: 'An unexpected error occurred', status: 500 };
        setError(apiError);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // setState calls here are in an event-handler callback, not in an effect body.
  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  }, []);

  return { data, isLoading, error, refetch };
}
