'use client';

import { useState, useEffect } from 'react';
import { toastStore, type ToastItem } from '@/lib/toastStore';

/**
 * 전역 에러 토스트 컴포넌트.
 * - toastStore를 구독하여 에러 메시지를 화면 하단 중앙에 표시
 * - 토스트는 3초 후 자동으로 사라지며 닫기 버튼으로 수동 해제 가능
 * - 동일 메시지 중복 표시 안 함 (toastStore 레벨에서 보장)
 * - 루트 layout에 포함하여 모든 페이지에서 동작
 */
export function ErrorToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 flex flex-col items-center gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-sm text-white shadow-lg"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4 flex-shrink-0 text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {toast.message}
          <button
            type="button"
            aria-label="닫기"
            onClick={() => toastStore.dismiss(toast.id)}
            className="ml-1 text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
