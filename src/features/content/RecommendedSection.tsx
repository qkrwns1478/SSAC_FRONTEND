'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RecommendedSkeleton } from './ContentSkeletons';
import type { RecommendedContent } from '@/types';

type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: RecommendedContent[]; isPersonalized: boolean };

export function RecommendedSection() {
  const [isLoggedIn] = useLocalStorage<boolean>('ssac_is_logged_in', false);
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setState({ status: 'loading' });
      try {
        if (isLoggedIn) {
          const personalized = await fetch('/api/content/personalized').then(
            (r) => r.json() as Promise<RecommendedContent[]>,
          );
          if (cancelled) return;

          if (Array.isArray(personalized) && personalized.length > 0) {
            setState({ status: 'success', items: personalized, isPersonalized: true });
            return;
          }

          // 개인화 데이터 없을 때 트렌드 기반으로 대체
          const trend = await fetch('/api/content/recommended').then(
            (r) => r.json() as Promise<RecommendedContent[]>,
          );
          if (!cancelled) {
            setState({ status: 'success', items: trend, isPersonalized: false });
          }
        } else {
          const trend = await fetch('/api/content/recommended').then(
            (r) => r.json() as Promise<RecommendedContent[]>,
          );
          if (!cancelled) {
            setState({ status: 'success', items: trend, isPersonalized: false });
          }
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'error', message: '추천 콘텐츠를 불러오는 데 실패했습니다.' });
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (state.status === 'loading') return <RecommendedSkeleton />;

  const sectionTitle =
    state.status === 'success' && state.isPersonalized
      ? '개인화 추천 콘텐츠'
      : '트렌드 추천 콘텐츠';

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{sectionTitle}</h2>

      {state.status === 'error' ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          {state.message}
        </p>
      ) : state.items.length === 0 ? (
        <p className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center text-sm text-gray-500">
          추천 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.items.map((item) => (
            <Link key={item.id} href={`/content/${item.id}`}>
              <article className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.summary}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
