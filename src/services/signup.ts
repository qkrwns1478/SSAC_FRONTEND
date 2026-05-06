import { env } from '@/lib/env';
import type { NicknameCheckResponse, SignupCompleteRequest, TermsAgreementRequest } from '@/types';

function getTempToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('signupTempToken');
}

/**
 * signup API는 실제 BE(`NEXT_PUBLIC_BACKEND_URL`)를 직접 호출한다.
 * tempToken은 JWT가 아니므로 Authorization 헤더가 아닌 요청 바디/파라미터로 전달한다.
 */
async function signupFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.backendUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    throw Object.assign(new Error(data.message ?? `HTTP ${res.status}`), {
      status: res.status,
      code: data.code,
    });
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const signupService = {
  /**
   * 필수/선택 약관 동의 정보를 서버에 제출한다.
   * POST /api/auth/terms
   * tempToken을 바디에 포함해 전달한다 (JWT가 아닌 커스텀 토큰).
   */
  agreeTerms(body: TermsAgreementRequest): Promise<void> {
    return signupFetch<void>('/api/auth/terms', {
      method: 'POST',
      body: JSON.stringify({ ...body, tempToken: getTempToken() }),
    });
  },

  /**
   * 닉네임 중복 여부를 확인한다.
   * GET /api/auth/nickname/check?nickname=xxx
   */
  checkNickname(nickname: string): Promise<NicknameCheckResponse> {
    const params = new URLSearchParams({ nickname });
    return signupFetch<NicknameCheckResponse>(`/api/auth/nickname/check?${params.toString()}`);
  },

  /**
   * 닉네임을 확정하고 회원가입을 완료한다.
   * BFF POST /api/auth/register → BE POST /api/auth/register
   * BFF가 accessToken을 httpOnly 쿠키로 설정한다.
   */
  async completeSignup(body: SignupCompleteRequest): Promise<void> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, tempToken: getTempToken() }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string; errorCode?: string };
      throw Object.assign(new Error(data.message ?? `HTTP ${res.status}`), {
        status: res.status,
        code: data.errorCode,
      });
    }
  },
};
