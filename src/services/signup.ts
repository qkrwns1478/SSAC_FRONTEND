// ⚠️ API 엔드포인트 미확정: BE 팀 swagger 추가 후 경로 검증 필요
import { apiClient } from './api';
import type { NicknameCheckResponse, SignupCompleteRequest, TermsAgreementRequest } from '@/types';

/**
 * sessionStorage에 저장된 signupTempToken을 Authorization 헤더로 변환한다.
 * 신규 사용자는 accessToken 쿠키가 없으므로 tempToken으로 인증한다.
 */
function getTempAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const tempToken = sessionStorage.getItem('signupTempToken');
  return tempToken ? { Authorization: `Bearer ${tempToken}` } : {};
}

export const signupService = {
  /**
   * 필수/선택 약관 동의 정보를 서버에 제출한다.
   * POST /api/v1/signup/terms
   * - TERMS-001: 필수 약관 미동의 → apiClient가 400 toast 처리
   * - TERMS-002: 이미 가입 완료 → 409 toast 처리 (호출자가 홈으로 이동)
   */
  agreeTerms(body: TermsAgreementRequest): Promise<void> {
    return apiClient.post<void>(
      '/api/v1/signup/terms',
      body as unknown as Record<string, unknown>,
      { headers: getTempAuthHeader() },
    );
  },

  /**
   * 닉네임 중복 여부를 확인한다.
   * GET /api/v1/signup/nickname/check?nickname=xxx
   */
  checkNickname(nickname: string): Promise<NicknameCheckResponse> {
    return apiClient.get<NicknameCheckResponse>('/api/v1/signup/nickname/check', {
      params: { nickname },
      headers: getTempAuthHeader(),
    });
  },

  /**
   * 닉네임을 확정하고 회원가입을 완료한다.
   * POST /api/v1/signup/complete
   * - USER-002: 닉네임 중복 (409)
   * - USER-003: 닉네임 형식 오류 (400)
   */
  completeSignup(body: SignupCompleteRequest): Promise<void> {
    return apiClient.post<void>(
      '/api/v1/signup/complete',
      body as unknown as Record<string, unknown>,
      { headers: getTempAuthHeader() },
    );
  },
};
