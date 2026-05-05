'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { signupService } from '@/services/signup';
import { cn } from '@/lib/utils';

// UI-only type: not derived from API contract
type CheckState = 'idle' | 'checking' | 'available' | 'unavailable';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,20}$/;

function getHelperText(checkState: CheckState, nickname: string): string {
  if (!nickname) return '2~20자, 특수문자 제외';
  if (!NICKNAME_REGEX.test(nickname)) return '2~20자, 한글·영문·숫자만 사용 가능합니다.';
  if (checkState === 'checking') return '확인 중...';
  if (checkState === 'available') return '사용 가능한 닉네임입니다.';
  if (checkState === 'unavailable') return '이미 사용 중인 닉네임입니다.';
  return '2~20자, 특수문자 제외';
}

export function NicknameSetup() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [checkState, setCheckState] = useState<CheckState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 500ms 디바운스 후 닉네임 중복 확인 — setState는 콜백 내에서만 호출
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = nickname.trim();
    debounceRef.current = setTimeout(async () => {
      if (!trimmed || !NICKNAME_REGEX.test(trimmed)) {
        setCheckState('idle');
        return;
      }
      setCheckState('checking');
      try {
        const { available } = await signupService.checkNickname(trimmed);
        setCheckState(available ? 'available' : 'unavailable');
      } catch {
        setCheckState('idle');
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [nickname]);

  const isFormatInvalid = nickname.length > 0 && !NICKNAME_REGEX.test(nickname.trim());
  const canSubmit = checkState === 'available' && !isFormatInvalid && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await signupService.completeSignup({ nickname: nickname.trim() });
      // 회원가입 완료 — 임시 인증 토큰 제거
      sessionStorage.removeItem('signupTempToken');
      sessionStorage.removeItem('signupProvider');
      router.replace('/');
    } catch {
      // apiClient가 USER-002/USER-003 toast 처리
      setCheckState('idle');
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasError = isFormatInvalid || checkState === 'unavailable';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nickname" className="text-sm font-medium text-gray-700">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="닉네임을 입력해주세요"
          aria-describedby="nickname-helper"
          aria-invalid={hasError}
          className={cn(
            'h-11 w-full rounded-lg border px-3 text-sm outline-none transition-colors',
            'focus:ring-2 focus:ring-offset-0',
            checkState === 'available' &&
              'border-green-500 focus:border-green-500 focus:ring-green-200',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            !checkState.match(/available/) &&
              !hasError &&
              'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
          )}
        />
        <p
          id="nickname-helper"
          className={cn(
            'text-xs',
            checkState === 'available' && 'text-green-600',
            hasError && 'text-red-500',
            !checkState.match(/available/) && !hasError && 'text-gray-500',
          )}
        >
          {getHelperText(isFormatInvalid ? 'idle' : checkState, nickname)}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={!canSubmit} isLoading={isSubmitting}>
        완료
      </Button>
    </form>
  );
}
