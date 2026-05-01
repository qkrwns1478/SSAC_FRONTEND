'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const SESSION_KEY = 'ssac_tagline_shown';

export function ServiceTagline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, '1');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!alreadyShown && !prefersReduced) {
      // 최초 진입: fade-in 애니메이션
      ref.current.dataset.taglineAnimate = 'true';
    } else {
      // 재진입 또는 reduced-motion: 즉시 표시
      ref.current.style.opacity = '1';
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        'mx-auto max-w-2xl break-keep text-2xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-100 sm:text-3xl md:text-4xl',
      )}
    >
      <p>금융 문맹 탈출의 첫 걸음,</p>
      <p>어려운 금융 지식을 SSAC(싹)으로 쉽게</p>
    </div>
  );
}
