'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const SESSION_KEY = 'ssac_tagline_shown';

/**
 * react-hooks/set-state-in-effect 규칙 대응:
 * effect 내 setState 대신 ref를 통한 DOM 직접 조작을 사용합니다.
 *
 * Strict Mode 이중 호출 방지를 위해 모듈 레벨 플래그를 사용합니다.
 * 첫 번째 effect 실행에서 DOM을 설정하고, 두 번째는 건너뜁니다.
 */
let _initialized = false;

export function ServiceTagline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (_initialized || !ref.current) return;
    _initialized = true;

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
        'mx-auto max-w-2xl break-keep text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl md:text-4xl',
      )}
    >
      <p>금융 문맹 탈출의 첫 걸음,</p>
      <p>어려운 금융 지식을 SSAC(싹)으로 쉽게</p>
    </div>
  );
}
